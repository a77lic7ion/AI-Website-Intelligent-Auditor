
import React from 'react';
import { LockIcon } from './icons';

interface LockedFeatureCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
}

const LockedFeatureCard: React.FC<LockedFeatureCardProps> = ({ title, icon, description }) => {
    return (
        <div className="bg-white dark:bg-auditor-card border border-gray-200 dark:border-auditor-border rounded-lg p-6 flex flex-col relative h-full">
            <div className="flex items-start space-x-3 text-gray-900 dark:text-auditor-text-primary mb-2">
                {icon}
                <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <p className="text-gray-500 dark:text-auditor-text-secondary text-sm flex-grow">{description}</p>
            <div className="absolute inset-0 bg-white/80 dark:bg-auditor-card/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg">
                 <div className="text-center p-4">
                    <button className="flex items-center space-x-2 bg-auditor-primary hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                        <LockIcon className="h-5 w-5" />
                        <span>Unlock with Pro</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LockedFeatureCard;