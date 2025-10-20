import React, { useState } from 'react';
import { User, Theme, AiProvider } from '../types';
import { testApiKey } from '../geminiService';

interface SettingsProps {
    currentUser: User;
    theme: Theme;
    onThemeChange: (theme: Theme) => void;
    apiKeys: Record<AiProvider, string>;
    onSaveApiKeys: (keys: Record<AiProvider, string>) => void;
}

const Settings: React.FC<SettingsProps> = ({ currentUser, theme, onThemeChange, apiKeys, onSaveApiKeys }) => {
    const [localKeys, setLocalKeys] = useState(apiKeys);
    const [testResults, setTestResults] = useState<Record<AiProvider, 'testing' | 'success' | 'failed' | null>>({
        [AiProvider.GEMINI]: null,
        [AiProvider.OPENAI]: null,
        [AiProvider.MISTRAL]: null,
        [AiProvider.OLLAMA]: null,
    });
    
    const handleKeyChange = (provider: AiProvider, value: string) => {
        setLocalKeys(prev => ({ ...prev, [provider]: value }));
        setTestResults(prev => ({ ...prev, [provider]: null })); // Reset test status on change
    };

    const handleSave = () => {
        onSaveApiKeys(localKeys);
        // Optionally, show a success message
    };

    const handleTestKey = async (provider: AiProvider) => {
        setTestResults(prev => ({ ...prev, [provider]: 'testing' }));
        const keyToTest = localKeys[provider];
        if (!keyToTest) {
             setTestResults(prev => ({ ...prev, [provider]: 'failed' }));
             return;
        }
        const isValid = await testApiKey(provider, keyToTest);
        setTestResults(prev => ({ ...prev, [provider]: isValid ? 'success' : 'failed' }));
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-auditor-text-primary">Settings</h1>
                <p className="text-gray-500 dark:text-auditor-text-secondary mt-1">Manage your account, API keys, and application preferences.</p>
            </div>

            {/* Account Section */}
            <div className="bg-white dark:bg-auditor-card border border-gray-200 dark:border-auditor-border rounded-lg">
                <div className="p-6 border-b border-gray-200 dark:border-auditor-border">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-auditor-text-primary">Account</h3>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-auditor-text-secondary mb-1">Full Name</label>
                        <input type="text" value={currentUser.fullName} disabled className="w-full max-w-xs bg-gray-100 dark:bg-auditor-dark border border-gray-300 dark:border-auditor-border rounded-md px-3 py-2 text-gray-500 dark:text-auditor-text-secondary"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-auditor-text-secondary mb-1">Email Address</label>
                        <input type="email" value={currentUser.email} disabled className="w-full max-w-xs bg-gray-100 dark:bg-auditor-dark border border-gray-300 dark:border-auditor-border rounded-md px-3 py-2 text-gray-500 dark:text-auditor-text-secondary"/>
                    </div>
                </div>
            </div>

            {/* API Providers Section */}
            <div className="bg-white dark:bg-auditor-card border border-gray-200 dark:border-auditor-border rounded-lg">
                <div className="p-6 border-b border-gray-200 dark:border-auditor-border">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-auditor-text-primary">AI Providers</h3>
                     <p className="text-sm text-gray-500 dark:text-auditor-text-secondary mt-1">Manage API keys for the AI models used in audits.</p>
                </div>
                <div className="p-6 space-y-6">
                    {(Object.values(AiProvider)).map(provider => (
                        <div key={provider}>
                            <label className="block text-sm font-medium text-gray-500 dark:text-auditor-text-secondary mb-1">{provider} {provider === AiProvider.OLLAMA ? 'Server URL' : 'API Key'}</label>
                            <div className="flex items-center space-x-2">
                                <input 
                                    type="text" 
                                    placeholder={provider === AiProvider.OLLAMA ? 'http://localhost:11434' : `Enter your ${provider} API Key`}
                                    value={localKeys[provider]}
                                    onChange={(e) => handleKeyChange(provider, e.target.value)}
                                    className="flex-grow bg-gray-50 dark:bg-auditor-dark border border-gray-300 dark:border-auditor-border rounded-md px-3 py-2 text-gray-900 dark:text-auditor-text-primary focus:outline-none focus:ring-2 focus:ring-auditor-primary"
                                />
                                <button onClick={() => handleTestKey(provider)} className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-auditor-text-secondary bg-white dark:bg-auditor-card hover:bg-gray-100 dark:hover:bg-auditor-border border border-gray-300 dark:border-auditor-border rounded-md transition-colors">
                                    {testResults[provider] === 'testing' ? 'Testing...' : 'Test'}
                                </button>
                            </div>
                            {testResults[provider] === 'success' && <p className="text-xs text-auditor-secondary mt-1">Connection successful!</p>}
                            {testResults[provider] === 'failed' && <p className="text-xs text-severity-high mt-1">Connection failed. Please check your key/URL and network.</p>}
                        </div>
                    ))}
                </div>
                 <div className="p-6 bg-gray-50 dark:bg-auditor-dark/50 border-t border-gray-200 dark:border-auditor-border rounded-b-lg flex justify-end">
                    <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-white bg-auditor-primary hover:bg-blue-600 rounded-md transition-colors">
                        Save API Keys
                    </button>
                </div>
            </div>

            {/* Appearance Section */}
            <div className="bg-white dark:bg-auditor-card border border-gray-200 dark:border-auditor-border rounded-lg">
                <div className="p-6 border-b border-gray-200 dark:border-auditor-border">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-auditor-text-primary">Appearance</h3>
                    <p className="text-sm text-gray-500 dark:text-auditor-text-secondary mt-1">Customize the look and feel of the application.</p>
                </div>
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                         <div>
                             <h4 className="font-medium text-gray-900 dark:text-auditor-text-primary">Theme</h4>
                             <p className="text-sm text-gray-500 dark:text-auditor-text-secondary">Select your preferred interface theme.</p>
                        </div>
                        <div className="flex items-center space-x-2 mt-3 sm:mt-0 p-1 bg-gray-100 dark:bg-auditor-dark rounded-lg">
                            <ThemeButton label="Light" currentTheme={theme} onClick={() => onThemeChange('light')} />
                            <ThemeButton label="Dark" currentTheme={theme} onClick={() => onThemeChange('dark')} />
                            <ThemeButton label="System" currentTheme={theme} onClick={() => onThemeChange('system')} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface ThemeButtonProps {
    label: string;
    currentTheme: Theme;
    onClick: () => void;
}
const ThemeButton: React.FC<ThemeButtonProps> = ({ label, currentTheme, onClick }) => {
    const isActive = currentTheme.toLowerCase() === label.toLowerCase();
    return (
        <button 
            onClick={onClick}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                isActive 
                ? 'bg-white dark:bg-auditor-card shadow text-auditor-primary' 
                : 'text-gray-500 dark:text-auditor-text-secondary hover:text-gray-900 dark:hover:text-auditor-text-primary'
            }`}
        >
            {label}
        </button>
    );
}


export default Settings;