import React, { useState } from 'react';
import { Issue, Severity } from '../types';
import { ArrowDownIcon, ArrowUpIcon } from './icons';

interface IssueRowProps {
    issue: Issue;
}

const severityStyles: Record<Severity, { bg: string; text: string; }> = {
    'Low': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-300' },
    'Medium': { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-800 dark:text-yellow-300' },
    'High': { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-800 dark:text-orange-300' },
    'Critical': { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-300' },
};


const IssueRow: React.FC<IssueRowProps> = ({ issue }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const styles = severityStyles[issue.severity] || severityStyles['Low'];

    return (
        <div className="border border-gray-200 dark:border-auditor-border rounded-lg">
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-auditor-border/20 transition-colors"
            >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                     <span className={`flex-shrink-0 px-2.5 py-0.5 text-xs font-semibold rounded-full ${styles.bg} ${styles.text}`}>{issue.severity}</span>
                     <h4 className="font-semibold text-gray-900 dark:text-auditor-text-primary truncate">{issue.title}</h4>
                </div>
                <div className="flex items-center space-x-3 flex-shrink-0 pl-4">
                     <span className="text-sm text-gray-500 dark:text-auditor-text-secondary hidden sm:block">{issue.category}</span>
                     {isExpanded ? <ArrowUpIcon className="h-5 w-5 text-gray-500 dark:text-auditor-text-secondary" /> : <ArrowDownIcon className="h-5 w-5 text-gray-500 dark:text-auditor-text-secondary" />}
                </div>
            </button>
            {isExpanded && (
                <div className="p-4 border-t border-gray-200 dark:border-auditor-border bg-gray-50 dark:bg-auditor-dark">
                    <h5 className="text-sm font-semibold text-gray-900 dark:text-auditor-text-primary mb-1">Description</h5>
                    <p className="text-sm text-gray-600 dark:text-auditor-text-secondary mb-3">{issue.description}</p>
                    <h5 className="text-sm font-semibold text-gray-900 dark:text-auditor-text-primary mb-1">Resolution</h5>
                    <p className="text-sm text-gray-600 dark:text-auditor-text-secondary whitespace-pre-wrap font-mono bg-white dark:bg-auditor-dark-deep p-2 rounded-md">{issue.resolution}</p>
                </div>
            )}
        </div>
    );
};

export default IssueRow;
