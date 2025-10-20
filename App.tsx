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
import { Page, Theme, User } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authPage, setAuthPage] = useState<'login' | 'signup'>('login');
  const [activePage, setActivePage] = useState<Page>('Dashboard');
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'system');
  const [auditTrigger, setAuditTrigger] = useState(0);
  const [isNewAuditModalOpen, setIsNewAuditModalOpen] = useState(false);
  const [auditedUrl, setAuditedUrl] = useState('https://example-audited-site.com');

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
    setAuthPage('login'); // Reset to login page on logout
  };

  const handleStartAudit = (url: string) => {
    setAuditedUrl(url);
    setAuditTrigger(prev => prev + 1);
    setIsNewAuditModalOpen(false);
    setActivePage('Dashboard'); // Switch to dashboard to see results
  };
  
  if (!currentUser) {
    if (authPage === 'login') {
      return <Login onLoginSuccess={handleLoginSuccess} onSwitchToSignUp={() => setAuthPage('signup')} />;
    } else {
      return <SignUp onLoginSuccess={handleLoginSuccess} onSwitchToLogin={() => setAuthPage('login')} />;
    }
  }

  const pageDetails = {
    Dashboard: { title: 'Website Audit Results', subtitle: `Results for ${auditedUrl}` },
    Reports: { title: 'Reports', subtitle: 'View and export your audit reports' },
    Integrations: { title: 'Integrations', subtitle: 'Connect with other services' },
    Settings: { title: 'Settings', subtitle: 'Manage your account and preferences' },
  };

  const renderContent = () => {
    switch (activePage) {
      case 'Dashboard':
        return <Dashboard currentUser={currentUser} auditTrigger={auditTrigger} auditedUrl={auditedUrl} />;
      case 'Reports':
        return <Reports />;
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
