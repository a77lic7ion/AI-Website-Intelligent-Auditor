
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
import { MOCK_AUDIT_REPORT } from './constants';
import { runAudit } from './geminiService';

type AuthState = 'login' | 'signup' | 'loggedin';

function App() {
  const [authState, setAuthState] = useState<AuthState>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState<Page>('Dashboard');
  const [theme, setTheme] = useState<Theme>('system');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [auditReports, setAuditReports] = useState<AuditReport[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);

  const [apiKeys, setApiKeys] = useState<Record<AiProvider, string>>({
    [AiProvider.GEMINI]: '',
    [AiProvider.OPENAI]: '',
    [AiProvider.MISTRAL]: '',
    [AiProvider.OLLAMA]: '',
  });

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
    // For demo, add a mock report on login
    if (auditReports.length === 0) {
      setAuditReports([MOCK_AUDIT_REPORT]);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthState('login');
  };

  const handleStartAudit = async (url: string, provider: AiProvider) => {
    setIsModalOpen(false);
    setIsAuditing(true);
    setAuditError(null);
    setActivePage('Dashboard'); // Switch to dashboard to see progress/results

    try {
        const reportData = await runAudit(url, provider);
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

  const latestReport = useMemo(() => auditReports.length > 0 ? auditReports[0] : null, [auditReports]);

  const pageContent = () => {
    switch (activePage) {
      case 'Dashboard':
        return <Dashboard latestReport={latestReport} onNewAuditClick={() => setIsModalOpen(true)} />;
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
                    onSaveApiKeys={setApiKeys}
                />;
      default:
        return <Dashboard latestReport={latestReport} onNewAuditClick={() => setIsModalOpen(true)} />;
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
                 <div className="flex flex-col items-center justify-center h-full text-center">
                    <h2 className="text-xl font-semibold text-severity-high">Audit Failed</h2>
                    <p className="text-gray-500 dark:text-auditor-text-secondary mt-2 max-w-md">{auditError}</p>
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
