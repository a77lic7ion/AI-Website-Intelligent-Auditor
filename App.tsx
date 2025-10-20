import React, { useState, useEffect } from 'react';
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
import { generateAuditReport } from './geminiService';

const App: React.FC = () => {
    // State management
    const [auth, setAuth] = useState<{ user: User | null; screen: 'login' | 'signup' | 'app' }>({ user: null, screen: 'login' });
    const [activePage, setActivePage] = useState<Page>('Dashboard');
    const [theme, setTheme] = useState<Theme>('system');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reports, setReports] = useState<AuditReport[]>([]);
    const [currentAudit, setCurrentAudit] = useState<AuditReport | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [apiKeys, setApiKeys] = useState<Record<AiProvider, string>>({
        [AiProvider.GEMINI]: process.env.API_KEY || '',
        [AiProvider.OPENAI]: '',
        [AiProvider.MISTRAL]: '',
        [AiProvider.OLLAMA]: '',
    });

    // Theme effect
    useEffect(() => {
        const applyTheme = () => {
            if (theme === 'system') {
                const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.documentElement.classList.toggle('dark', systemPrefersDark);
            } else {
                document.documentElement.classList.toggle('dark', theme === 'dark');
            }
        };
        applyTheme();
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', applyTheme);
        return () => mediaQuery.removeEventListener('change', applyTheme);
    }, [theme]);

    // Handlers
    const handleLoginSuccess = (user: User) => {
        setAuth({ user, screen: 'app' });
    };

    const handleLogout = () => {
        setAuth({ user: null, screen: 'login' });
        setActivePage('Dashboard');
    };

    const handleStartAudit = async (url: string, provider: AiProvider) => {
        setIsModalOpen(false);
        setIsLoading(true);
        setError(null);
        setCurrentAudit(null);
        setActivePage('Dashboard');

        try {
            const apiKey = apiKeys[provider];
            if (provider === AiProvider.GEMINI && !apiKey) {
                throw new Error('Gemini API key is not set. Please add it in Settings.');
            }
            
            const newReport = await generateAuditReport(url, provider, apiKey);
            setReports(prev => [newReport, ...prev]);
            setCurrentAudit(newReport);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred during the audit.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderPage = () => {
        switch (activePage) {
            case 'Dashboard':
                return <Dashboard latestReport={currentAudit} isLoading={isLoading} error={error} onNewAuditClick={() => setIsModalOpen(true)} />;
            case 'Reports':
                return <Reports reports={reports} />;
            case 'Integrations':
                return <Integrations />;
            case 'Settings':
                return <Settings currentUser={auth.user!} theme={theme} onThemeChange={setTheme} apiKeys={apiKeys} onSaveApiKeys={setApiKeys} />;
            default:
                return <Dashboard latestReport={currentAudit} isLoading={isLoading} error={error} onNewAuditClick={() => setIsModalOpen(true)} />;
        }
    };

    // Render logic
    if (auth.screen === 'login') {
        return <Login onLoginSuccess={handleLoginSuccess} onSwitchToSignUp={() => setAuth(prev => ({ ...prev, screen: 'signup' }))} />;
    }

    if (auth.screen === 'signup') {
        return <SignUp onLoginSuccess={handleLoginSuccess} onSwitchToLogin={() => setAuth(prev => ({ ...prev, screen: 'login' }))} />;
    }

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-auditor-dark-deep font-sans">
            <Sidebar activePage={activePage} onNavigate={setActivePage} onLogout={handleLogout} currentUser={auth.user} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    title={activePage} 
                    subtitle="Welcome back, let's get auditing!" 
                    onNewAuditClick={() => setIsModalOpen(true)} 
                />
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    {renderPage()}
                </main>
            </div>
            <NewAuditModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onStartAudit={handleStartAudit}
            />
        </div>
    );
};

export default App;
