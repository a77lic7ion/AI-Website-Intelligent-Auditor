import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import Integrations from './components/Integrations';
import Settings from './components/Settings';
import NewAuditModal from './components/NewAuditModal';
import Login from './components/Login';
import SignUp from './components/SignUp';
import { Page, User, AiGeneratedAudit, Theme, AiProvider } from './types';
import { runAudit } from './geminiService';

const App: React.FC = () => {
    // Authentication State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authScreen, setAuthScreen] = useState<'login' | 'signup'>('login');
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // API Key State
    const [apiKeys, setApiKeys] = useState<Record<AiProvider, string>>({
        [AiProvider.GEMINI]: '',
        [AiProvider.OPENAI]: '',
        [AiProvider.MISTRAL]: '',
        [AiProvider.OLLAMA]: '',
    });

    // Navigation and UI State
    const [activePage, setActivePage] = useState<Page>('Dashboard');
    const [theme, setTheme] = useState<Theme>('system');
    const [isNewAuditModalOpen, setIsNewAuditModalOpen] = useState(false);

    // Audit State
    const [auditResult, setAuditResult] = useState<AiGeneratedAudit | null>(null);
    const [auditedUrl, setAuditedUrl] = useState<string>('');
    const [isAuditing, setIsAuditing] = useState(false);
    const [auditError, setAuditError] = useState<string | null>(null);

    // Load saved data on initial render
    useEffect(() => {
        // User session
        const savedUser = localStorage.getItem('siteAuditorUser');
        if (savedUser) {
            const user = JSON.parse(savedUser);
            setCurrentUser(user);
            setIsAuthenticated(true);
        }
        // API Keys
        const savedKeys = localStorage.getItem('siteAuditorApiKeys');
        if (savedKeys) {
            setApiKeys(JSON.parse(savedKeys));
        }
        // Theme
        const savedTheme = localStorage.getItem('siteAuditorTheme') as Theme | null;
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    // Apply theme changes
    useEffect(() => {
        if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('siteAuditorTheme', theme);
    }, [theme]);

    const handleLogin = (user: {email: string; fullName: string;}) => {
        const proUser: User = { ...user, isPro: user.email === 'shaunwg@outlook.com' };
        setCurrentUser(proUser);
        setIsAuthenticated(true);
        localStorage.setItem('siteAuditorUser', JSON.stringify(proUser));
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setIsAuthenticated(false);
        setAuditResult(null);
        setAuditedUrl('');
        setActivePage('Dashboard');
        localStorage.removeItem('siteAuditorUser');
    };

    const handleSaveApiKeys = (keys: Record<AiProvider, string>) => {
        setApiKeys(keys);
        localStorage.setItem('siteAuditorApiKeys', JSON.stringify(keys));
    };

    const handleStartAudit = async (url: string, provider: AiProvider) => {
        setIsNewAuditModalOpen(false);
        setActivePage('Dashboard');
        setIsAuditing(true);
        setAuditError(null);
        setAuditedUrl(url);
        setAuditResult(null);

        const apiKey = apiKeys[provider];
        if (!apiKey && provider !== AiProvider.OLLAMA) {
             setAuditError(`API Key for ${provider} is not set. Please add it in Settings.`);
             setIsAuditing(false);
             return;
        }
        if (!apiKeys[AiProvider.OLLAMA] && provider === AiProvider.OLLAMA) {
            setAuditError(`Ollama Server URL is not set. Please add it in Settings.`);
            setIsAuditing(false);
            return;
        }

        try {
            // Use a CORS proxy to fetch URL content to avoid browser security restrictions.
            const proxyUrl = 'https://api.allorigins.win/raw?url=';
            const response = await fetch(`${proxyUrl}${encodeURIComponent(url)}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch URL content via proxy (${response.status} ${response.statusText}). The target website might be down or blocking requests.`);
            }
            const htmlContent = await response.text();
            
            const result = await runAudit(provider, apiKey, url, htmlContent);
            setAuditResult(result);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An unknown error occurred.';
            setAuditError(message);
        } finally {
            setIsAuditing(false);
        }
    };

    const renderPage = () => {
        if (!currentUser) return null;
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
            case 'Integrations':
                return <Integrations />;
            case 'Settings':
                return <Settings 
                    currentUser={currentUser} 
                    theme={theme}
                    onThemeChange={setTheme}
                    apiKeys={apiKeys}
                    onSaveApiKeys={handleSaveApiKeys}
                />;
            default:
                return null;
        }
    };

    if (!isAuthenticated || !currentUser) {
        if (authScreen === 'login') {
            return <Login onLoginSuccess={handleLogin} onSwitchToSignUp={() => setAuthScreen('signup')} />;
        }
        return <SignUp onLoginSuccess={handleLogin} onSwitchToLogin={() => setAuthScreen('login')} />;
    }

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-auditor-dark">
            <Sidebar 
                activePage={activePage} 
                onNavigate={setActivePage} 
                onLogout={handleLogout}
                currentUser={currentUser}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    title={activePage} 
                    subtitle={activePage === 'Dashboard' && auditedUrl ? `Audit results for ${auditedUrl}` : `Manage your ${activePage.toLowerCase()}`}
                    onNewAuditClick={() => setIsNewAuditModalOpen(true)}
                />
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    {renderPage()}
                </main>
            </div>
            <NewAuditModal 
                isOpen={isNewAuditModalOpen}
                onClose={() => setIsNewAuditModalOpen(false)}
                onStartAudit={handleStartAudit}
            />
        </div>
    );
};

export default App;