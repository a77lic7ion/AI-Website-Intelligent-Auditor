import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import Integrations from './components/Integrations';
import Reports from './components/Reports';
import { Page, Theme } from './types';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('Dashboard');
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'system');

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


  const pageDetails = {
    Dashboard: { title: 'Website Audit Results', subtitle: 'Last updated: 2024-01-15' },
    Reports: { title: 'Reports', subtitle: 'View and export your audit reports' },
    Integrations: { title: 'Integrations', subtitle: 'Connect with other services' },
    Settings: { title: 'Settings', subtitle: 'Manage your account and preferences' },
  };

  const renderContent = () => {
    switch (activePage) {
      case 'Dashboard':
        return <Dashboard />;
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
    <div className="flex h-screen bg-gray-50 dark:bg-auditor-dark text-gray-900 dark:text-auditor-text-primary font-sans">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="flex flex-col flex-1">
        <Header title={pageDetails[activePage].title} subtitle={pageDetails[activePage].subtitle} />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;