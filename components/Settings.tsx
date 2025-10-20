
import React, { useState } from 'react';
import { Theme } from '../types';

type SettingsTab = 'Account' | 'Subscription' | 'Notifications' | 'Integrations';

interface SettingsProps {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const Settings: React.FC<SettingsProps> = ({ theme, setTheme }) => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('Account');

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex border-b border-gray-200 dark:border-auditor-border mb-8">
                <TabButton name="Account" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton name="Subscription" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton name="Notifications" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton name="Integrations" activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            <div>
                {activeTab === 'Account' && <AccountSettings theme={theme} setTheme={setTheme} />}
                {activeTab !== 'Account' && <PlaceholderSettings tabName={activeTab} />}
            </div>
        </div>
    );
};

interface TabButtonProps {
    name: SettingsTab;
    activeTab: SettingsTab;
    setActiveTab: (tab: SettingsTab) => void;
}

const TabButton: React.FC<TabButtonProps> = ({ name, activeTab, setActiveTab }) => {
    const isActive = name === activeTab;
    return (
        <button
            onClick={() => setActiveTab(name)}
            className={`px-4 py-2 -mb-px font-semibold text-sm border-b-2 transition-colors duration-200
                ${isActive ? 'border-auditor-primary text-auditor-primary' : 'border-transparent text-gray-500 dark:text-auditor-text-secondary hover:text-gray-900 dark:hover:text-auditor-text-primary'}
            `}
        >
            {name}
        </button>
    );
};

const AccountSettings: React.FC<SettingsProps> = ({ theme, setTheme }) => {
    return (
        <div className="space-y-12">
            {/* Account Information */}
            <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-auditor-text-primary mb-4">Account Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-500 dark:text-auditor-text-secondary mb-2">Email</label>
                        <input type="email" id="email" value="alex.murphy@auditorpro.com" readOnly className="w-full bg-gray-100 dark:bg-auditor-dark border border-gray-300 dark:border-auditor-border rounded-md px-3 py-2 text-gray-500 dark:text-auditor-text-secondary focus:outline-none" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-500 dark:text-auditor-text-secondary mb-2">Password</label>
                        <input type="password" id="password" value="••••••••••" readOnly className="w-full bg-gray-100 dark:bg-auditor-dark border border-gray-300 dark:border-auditor-border rounded-md px-3 py-2 text-gray-500 dark:text-auditor-text-secondary focus:outline-none" />
                    </div>
                </div>
                 <button className="mt-4 bg-white dark:bg-auditor-card hover:bg-gray-100 dark:hover:bg-auditor-border text-gray-900 dark:text-auditor-text-primary font-semibold px-4 py-2 rounded-lg transition-colors border border-gray-300 dark:border-auditor-border">
                    Update Password
                </button>
            </section>

            {/* Theme Preferences */}
            <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-auditor-text-primary mb-4">Theme Preferences</h2>
                <div className="flex flex-wrap gap-4">
                    <ThemeOption label="Light" value="light" currentTheme={theme} setTheme={setTheme} />
                    <ThemeOption label="Dark" value="dark" currentTheme={theme} setTheme={setTheme} />
                    <ThemeOption label="System Default" value="system" currentTheme={theme} setTheme={setTheme} />
                </div>
            </section>
            
            <div className="border-t border-gray-200 dark:border-auditor-border"></div>

            {/* Delete Account */}
            <section>
                 <h2 className="text-xl font-semibold text-severity-high mb-2">Delete Account</h2>
                 <p className="text-gray-500 dark:text-auditor-text-secondary text-sm mb-4 max-w-2xl">
                    Deleting your account will permanently remove all your data, including audits, reports, and personal information. This action cannot be undone. Please be certain before proceeding.
                 </p>
                 <button className="bg-severity-high/20 hover:bg-severity-high/40 text-severity-high font-semibold px-4 py-2 rounded-lg transition-colors">
                    Delete My Account
                </button>
            </section>
        </div>
    );
};

interface ThemeOptionProps {
    label: string;
    value: Theme;
    currentTheme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeOption: React.FC<ThemeOptionProps> = ({ label, value, currentTheme, setTheme }) => (
    <label className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-auditor-border rounded-lg cursor-pointer bg-white dark:bg-auditor-card min-w-[160px] justify-center hover:border-gray-400 dark:hover:border-auditor-text-secondary transition-colors">
        <input 
            type="radio" 
            name="theme" 
            value={value} 
            checked={currentTheme === value}
            onChange={() => setTheme(value)}
            className="form-radio h-4 w-4 text-auditor-primary bg-gray-100 dark:bg-auditor-dark border-gray-300 dark:border-auditor-border focus:ring-auditor-primary focus:ring-offset-white dark:focus:ring-offset-auditor-dark" 
        />
        <span className="text-sm font-medium text-gray-900 dark:text-auditor-text-primary">{label}</span>
    </label>
);

const PlaceholderSettings: React.FC<{tabName: string}> = ({tabName}) => (
    <div className="flex items-center justify-center h-48 bg-gray-50 dark:bg-auditor-card border border-gray-200 dark:border-auditor-border rounded-lg">
        <p className="text-gray-500 dark:text-auditor-text-secondary">{tabName} settings are not yet available.</p>
    </div>
);


export default Settings;