import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import Integrations from './components/Integrations';
import Settings from './components/Settings';
import Login from './components/Login';
import SignUp from './components/SignUp';
import NewAuditModal from './components/NewAuditModal';
import { Page, User, Theme, AiProvider, AuditReport } from './types';
import { runAudit } from './geminiService';
import { ErrorIcon } from './components/icons';

type AuthState = 'login' | 'signup' | 'loggedin';

function App() {
  const [authState, setAuthState] = useState<AuthState>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState<Page>('Dashboard');
  const [theme, setTheme] = useState<Theme>('system');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [auditReports, setAuditReports] = useState<AuditReport[]>([]);
  const [savedReports, setSavedReports] = useState<AuditReport[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);

  const [apiKeys, setApiKeys] = useState<Record<AiProvider, string>>(() => {
    const savedKeys = localStorage.getItem('apiKeys');
    return savedKeys ? JSON.parse(savedKeys) : {
      [AiProvider.GEMINI]: '',
      [AiProvider.OPENAI]: '',
      [AiProvider.MISTRAL]: '',
      [AiProvider.OLLAMA]: '',
    };
  });

  // Load saved reports from local storage on initial render
  useEffect(() => {
    const storedReports = localStorage.getItem('savedAuditReports');
    if (storedReports) {
      setSavedReports(JSON.parse(storedReports));
    }
  }, []);

  // Theme management
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
        setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      document.documentElement.classList.toggle('dark', mediaQuery.matches);
      const handler = (e: MediaQueryListEvent) => document.documentElement.classList.toggle('dark', e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setAuthState('loggedin');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthState('login');
  };
  
  const handleSaveApiKeys = (keys: Record<AiProvider, string>) => {
    setApiKeys(keys);
    localStorage.setItem('apiKeys', JSON.stringify(keys));
  };

  const handleStartAudit = async (url: string, provider: AiProvider) => {
    setIsModalOpen(false);
    setIsAuditing(true);
    setAuditError(null);
    setActivePage('Dashboard');

    const apiKey = apiKeys[provider];
    if (!apiKey && provider !== AiProvider.OLLAMA) {
        setAuditError(`API Key for ${provider} is not set. Please add it in Settings.`);
        setIsAuditing(false);
        return;
    }

    try {
        const reportData = await runAudit(url, provider, apiKey);
        const newReport: AuditReport = {
            id: new Date().toISOString(),
            url,
            provider,
            timestamp: Date.now(),
            reportData,
            score: reportData.score
        };
        setAuditReports(prev => [newReport, ...prev]);
    } catch (error) {
        setAuditError(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
        setIsAuditing(false);
    }
  };

  const handleSaveReport = (reportToSave: AuditReport) => {
    setSavedReports(prevSavedReports => {
      if (prevSavedReports.some(report => report.id === reportToSave.id)) {
        alert("This report is already saved.");
        return prevSavedReports;
      }
      const updatedReports = [reportToSave, ...prevSavedReports];
      localStorage.setItem('savedAuditReports', JSON.stringify(updatedReports));
      alert("Report saved successfully!");
      return updatedReports;
    });
  };

  const latestReport = useMemo(() => auditReports.length > 0 ? auditReports[0] : null, [auditReports]);

  const isLatestReportSaved = useMemo(() => {
    if (!latestReport) return false;
    return savedReports.some(savedReport => savedReport.id === latestReport.id);
  }, [latestReport, savedReports]);

  const pageContent = () => {
    switch (activePage) {
      case 'Dashboard':
        return <Dashboard 
                  latestReport={latestReport} 
                  onNewAuditClick={() => setIsModalOpen(true)} 
                  currentUser={currentUser}
                  onSaveReport={handleSaveReport}
                  isLatestReportSaved={isLatestReportSaved}
                />;
      case 'Reports':
        return <Reports reports={auditReports} />;
      case 'Integrations':
        return <Integrations />;
      case 'Settings':
        return <Settings 
                    currentUser={currentUser!} 
                    theme={theme} 
                    onThemeChange={setTheme}
                    apiKeys={apiKeys}
                    onSaveApiKeys={handleSaveApiKeys}
                />;
      default:
        return <Dashboard 
                  latestReport={latestReport} 
                  // Fix: Corrected typo from setIsModalОpen to setIsModalOpen
                  onNewAuditClick={() => setIsModalOpen(true)} 
                  currentUser={currentUser}
                  onSaveReport={handleSaveReport}
                  isLatestReportSaved={isLatestReportSaved}
               />;
    }
  };
  
  const pageMeta = {
      'Dashboard': 'View your latest audit report and key metrics.',
      'Reports': 'Browse the history of all your website audits.',
      'Integrations': 'Connect your favorite tools to streamline your workflow.',
      'Settings': 'Manage your account and application preferences.'
  }

  if (authState === 'login') {
      return <Login onLoginSuccess={handleLogin} onSwitchToSignUp={() => setAuthState('signup')} />;
  }
  
  if (authState === 'signup') {
      return <SignUp onLoginSuccess={handleLogin} onSwitchToLogin={() => setAuthState('login')} />;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-auditor-dark font-sans">
      <Sidebar 
        activePage={activePage} 
        onNavigate={setActivePage} 
        onLogout={handleLogout}
        currentUser={currentUser}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
            title={activePage} 
            subtitle={pageMeta[activePage]}
            onNewAuditClick={() => setIsModalOpen(true)} 
        />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            {isAuditing && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-auditor-primary mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-auditor-text-primary">Running Audit...</h2>
                    <p className="text-gray-500 dark:text-auditor-text-secondary mt-2 max-w-md">Analyzing your website. This might take a minute.</p>
                </div>
            )}
            {auditError && (
                 <div className="flex flex-col items-center justify-center h-full text-center bg-white dark:bg-auditor-card border border-red-200 dark:border-severity-high/30 rounded-lg p-8">
                    <ErrorIcon className="h-12 w-12 text-severity-high mb-4" />
                    <h2 className="text-xl font-semibold text-severity-high">Audit Failed</h2>
                    <p className="text-gray-500 dark:text-auditor-text-secondary mt-2 max-w-md">{auditError}</p>
                     <button 
                        onClick={() => setIsModalOpen(true)} 
                        className="mt-6 bg-auditor-primary hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
                    >
                        Try a New Audit
                    </button>
                 </div>
            )}
            {!isAuditing && !auditError && pageContent()}
        </main>
      </div>
      <NewAuditModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStartAudit={handleStartAudit}
      />
    </div>
  );
}

export default App;