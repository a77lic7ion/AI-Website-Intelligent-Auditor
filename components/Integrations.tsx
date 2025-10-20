
import React from 'react';
import { GitHubIcon, SlackIcon, JiraIcon, VercelIcon, CheckIcon } from './icons';

interface Integration {
    name: string;
    description: string;
    connected: boolean;
    icon: React.ReactNode;
}

const INTEGRATIONS_LIST: Integration[] = [
    {
        name: 'GitHub',
        description: 'Link audits to repositories and track issues directly from your codebase.',
        connected: true,
        icon: <GitHubIcon className="h-8 w-8 text-gray-800 dark:text-auditor-text-primary" />
    },
    {
        name: 'Slack',
        description: 'Get real-time notifications about completed audits and critical issues.',
        connected: false,
        icon: <SlackIcon className="h-8 w-8 text-gray-800 dark:text-auditor-text-primary" />
    },
    {
        name: 'Jira',
        description: 'Create Jira tickets automatically from audit findings to streamline your workflow.',
        connected: false,
        icon: <JiraIcon className="h-8 w-8 text-gray-800 dark:text-auditor-text-primary" />
    },
    {
        name: 'Vercel',
        description: 'Automatically trigger site audits on new deployments to catch issues early.',
        connected: true,
        icon: <VercelIcon className="h-8 w-8 text-gray-800 dark:text-auditor-text-primary" />
    },
];

const Integrations: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-auditor-text-primary">Integrations</h1>
                <p className="text-gray-500 dark:text-auditor-text-secondary mt-1">Connect your tools to streamline your workflow and enhance your auditing process.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {INTEGRATIONS_LIST.map((integration) => (
                    <IntegrationCard key={integration.name} {...integration} />
                ))}
            </div>
        </div>
    );
};

const IntegrationCard: React.FC<Integration> = ({ name, description, connected, icon }) => {
    return (
        <div className="bg-white dark:bg-auditor-card border border-gray-200 dark:border-auditor-border rounded-lg p-6 flex flex-col h-full">
            <div className="flex items-center space-x-4 mb-4">
                {icon}
                <h2 className="text-xl font-semibold text-gray-900 dark:text-auditor-text-primary">{name}</h2>
            </div>
            <p className="text-gray-500 dark:text-auditor-text-secondary text-sm flex-grow mb-6">{description}</p>
            {connected ? (
                <button 
                    className="mt-auto w-full flex items-center justify-center space-x-2 bg-transparent text-auditor-secondary font-semibold px-4 py-2 rounded-lg border border-auditor-secondary"
                    disabled
                >
                    <CheckIcon className="h-5 w-5" />
                    <span>Connected</span>
                </button>
            ) : (
                <button className="mt-auto w-full bg-white dark:bg-auditor-card hover:bg-gray-100 dark:hover:bg-auditor-border text-gray-900 dark:text-auditor-text-primary font-semibold px-4 py-2 rounded-lg transition-colors border border-gray-300 dark:border-auditor-border hover:border-auditor-primary dark:hover:border-auditor-primary">
                    Connect
                </button>
            )}
        </div>
    );
};

export default Integrations;