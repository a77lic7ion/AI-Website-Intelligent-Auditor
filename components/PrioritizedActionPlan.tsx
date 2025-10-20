import React from 'react';
import { ActionPlanIcon } from './icons';

interface ActionItem {
    title: string;
    description: string;
}

interface PrioritizedActionPlanProps {
    plan: ActionItem[];
}

const PrioritizedActionPlan: React.FC<PrioritizedActionPlanProps> = ({ plan }) => {
    return (
        <div className="bg-white dark:bg-auditor-card border border-gray-200 dark:border-auditor-border rounded-lg p-6 h-full">
            <div className="flex items-center space-x-3 text-gray-900 dark:text-auditor-text-primary mb-4">
                <ActionPlanIcon className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Prioritized Action Plan</h3>
            </div>
            <div className="space-y-4">
                {plan.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center bg-auditor-primary/20 text-auditor-primary rounded-full font-bold text-sm">
                            {index + 1}
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-auditor-text-primary">{item.title}</h4>
                            <p className="text-sm text-gray-500 dark:text-auditor-text-secondary mt-1">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PrioritizedActionPlan;