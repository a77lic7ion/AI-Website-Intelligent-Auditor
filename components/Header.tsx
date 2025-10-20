
import React from 'react';
import { HelpIcon, PlusIcon } from './icons';

interface HeaderProps {
    title: string;
    subtitle: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
    return (
        <header className="flex-shrink-0 bg-white dark:bg-auditor-dark border-b border-gray-200 dark:border-auditor-border h-16 flex items-center justify-between px-6 lg:px-8">
            <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-auditor-text-primary">{title}</h2>
                <p className="text-sm text-gray-500 dark:text-auditor-text-secondary">{subtitle}</p>
            </div>
            <div className="flex items-center space-x-4">
                <button className="text-gray-500 dark:text-auditor-text-secondary hover:text-gray-900 dark:hover:text-auditor-text-primary transition-colors">
                    <HelpIcon className="h-6 w-6" />
                </button>
                <button className="flex items-center space-x-2 bg-auditor-primary hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                    <PlusIcon className="h-5 w-5" />
                    <span>New Audit</span>
                </button>
            </div>
        </header>
    );
};

export default Header;