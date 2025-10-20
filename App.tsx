import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import Integrations from './components/Integrations';
import Reports from './components/Reports';
import Login from './components/Login';
import SignUp from './components/SignUp';
import NewAuditModal from './components/NewAuditModal';
import { Page, Theme, User, AiGeneratedAudit } from './types';
import { generateAudit } from './geminiService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authPage, setAuthPage] = useState<'login' | 'signup'>('login');
  const [activePage, setActivePage] = useState<Page>('Dashboard');
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'system');
  
  const [isNewAuditModalOpen, setIsNewAuditModalOpen] = useState(false);
  const [auditedUrl, setAuditedUrl] = useState('');
  
  const [auditResult, setAuditResult] = useState<AiGeneratedAudit | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);


  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.classList.toggle('dark', isDark);
    localStorage.setItem('theme', theme);
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        root.classList.toggle('dark', mediaQuery.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const handleLoginSuccess = (user: { email: string; fullName: string; }) => {
    const isPro = user.email.toLowerCase() === 'shaunwg@outlook.com';
    setCurrentUser({ ...user, isPro });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthPage('login'); 
    setAuditResult(null);
    setAuditedUrl('');
  };

  const handleStartAudit = async (url: string) => {
    setAuditedUrl(url);
    setIsNewAuditModalOpen(false);
    setActivePage('Dashboard');
    setIsAuditing(true);
    setAuditError(null);
    setAuditResult(null);

    try {
      const result = await generateAudit(url);
      setAuditResult(result);
    } catch (error) {
      console.error("Audit generation failed:", error);
      setAuditError("Failed to generate the audit. The Gemini API might be unavailable or the URL may be inaccessible. Please check the console for more details.");
    } finally {
      setIsAuditing(false);
    }
  };
  
  if (!currentUser) {
    if (authPage === 'login') {
      return <Login onLoginSuccess={handleLoginSuccess} onSwitchToSignUp={() => setAuthPage('signup')} />;
    } else {
      return <SignUp onLoginSuccess={handleLoginSuccess} onSwitchToLogin={() => setAuthPage('login')} />;
    }
  }

  const pageDetails = {
    Dashboard: { title: 'Website Audit Results', subtitle: auditedUrl ? `Results for ${auditedUrl}` : 'Start an audit to see results' },
    Reports: { title: 'Reports', subtitle: 'View and export your audit reports' },
    Integrations: { title: 'Integrations', subtitle: 'Connect with other services' },
    Settings: { title: 'Settings', subtitle: 'Manage your account and preferences' },
  };

  const renderContent = () => {
    switch (activePage) {
      case 'Dashboard':
        return <Dashboard 
                  currentUser={currentUser} 
                  auditedUrl={auditedUrl} 
                  auditResult={auditResult}
                  isAuditing={isAuditing}
                  auditError={auditError}
                  onNewAuditClick={() => setIsNewAuditModalOpen(true)}
                />;
      case 'Reports':
        return <Reports auditResult={auditResult} />;
      case 'Settings':
        return <Settings theme={theme} setTheme={setTheme} />;
      case 'Integrations':
        return <Integrations />;
      default:
        return <div className="flex items-center justify-center h-full"><p className="text-auditor-text-secondary text-lg">Coming Soon!</p></div>;
    }
  };

  return (
    <>
      <div className="flex h-screen bg-gray-50 dark:bg-auditor-dark text-gray-900 dark:text-auditor-text-primary font-sans">
        <Sidebar activePage={activePage} onNavigate={setActivePage} onLogout={handleLogout} currentUser={currentUser} />
        <div className="flex flex-col flex-1">
          <Header 
            title={pageDetails[activePage].title} 
            subtitle={pageDetails[activePage].subtitle} 
            onNewAuditClick={() => setIsNewAuditModalOpen(true)} 
          />
          <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
            {renderContent()}
          </main>
        </div>
      </div>
      <NewAuditModal 
        isOpen={isNewAuditModalOpen}
        onClose={() => setIsNewAuditModalOpen(false)}
        onStartAudit={handleStartAudit}
      />
    </>
  );
};

export default App;