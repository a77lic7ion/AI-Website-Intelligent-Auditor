import React from 'react';
import { SnippetsIcon, GitHubIcon } from './icons';
import LockedFeatureCard from './LockedFeatureCard';

interface AutomaticCodeFixesProps {
    isUnlocked: boolean;
}

const AutomaticCodeFixes: React.FC<AutomaticCodeFixesProps> = ({ isUnlocked }) => {
    if (!isUnlocked) {
        return (
            <LockedFeatureCard
                icon={<SnippetsIcon className="h-6 w-6" />}
                title="Automatic Code Fixes"
                description="Upgrade to Pro to get automatically generated code fixes that you can apply with one click."
            />
        );
    }
    
    return (
        <div className="bg-white dark:bg-auditor-card border border-gray-200 dark:border-auditor-border rounded-lg p-6 flex flex-col h-full">
            <div className="flex items-start space-x-3 text-gray-900 dark:text-auditor-text-primary mb-2">
                <SnippetsIcon className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Automatic Code Fixes</h3>
            </div>
            <p className="text-gray-500 dark:text-auditor-text-secondary text-sm flex-grow">Connect your GitHub account to enable automatic pull requests for code fixes.</p>
            <button className="mt-4 flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-900 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                <GitHubIcon className="h-5 w-5" />
                <span>Connect GitHub</span>
            </button>
        </div>
    );
};

export default AutomaticCodeFixes;
