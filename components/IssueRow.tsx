
import React from 'react';
import { Issue } from '../types';
import { ArrowUpIcon, ArrowDownIcon, ErrorIcon } from './icons';

interface IssueRowProps {
    issue: Issue;
    onToggle: (id: string) => void;
}

const severityConfig = {
    High: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-800 dark:text-red-300',
        icon: 'text-severity-high'
    },
    Medium: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-800 dark:text-yellow-300',
        icon: 'text-severity-medium'
    },
    Low: {
        bg: 'bg-gray-100 dark:bg-gray-700/30',
        text: 'text-gray-800 dark:text-gray-300',
        icon: 'text-severity-low'
    },
};

const IssueRow: React.FC<IssueRowProps> = ({ issue, onToggle }) => {
    const config = severityConfig[issue.severity];

    return (
        <>
            <tr onClick={() => onToggle(issue.id)} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-auditor-dark">
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <ErrorIcon className={`h-5 w-5 mr-2 ${config.icon}`} />
                        <span className="text-sm font-medium text-gray-900 dark:text-auditor-text-primary">{issue.title}</span>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${config.bg} ${config.text}`}>
                        {issue.severity}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="text-gray-400 hover:text-gray-600 dark:text-auditor-text-secondary dark:hover:text-auditor-text-primary">
                        {issue.isExpanded ? <ArrowUpIcon className="h-5 w-5" /> : <ArrowDownIcon className="h-5 w-5" />}
                    </button>
                </td>
            </tr>
            {issue.isExpanded && (
                <tr>
                    <td colSpan={3} className="px-6 py-4 bg-gray-50 dark:bg-auditor-dark">
                        <div className="space-y-2">
                             <p className="text-sm text-gray-700 dark:text-auditor-text-primary">{issue.description}</p>
                             <h4 className="text-sm font-semibold text-gray-900 dark:text-auditor-text-primary pt-2">Recommendation</h4>
                             <p className="text-sm text-gray-500 dark:text-auditor-text-secondary">{issue.recommendation}</p>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

export default IssueRow;
