import React, { useState } from 'react';
import { Issue, IssueSeverity } from '../types';

export const IssueRow: React.FC<{ issue: Issue; isLast: boolean }> = ({ issue, isLast }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const severityClasses = {
        [IssueSeverity.High]: 'bg-severity-high/20 text-severity-high',
        [IssueSeverity.Medium]: 'bg-severity-medium/20 text-severity-medium',
        [IssueSeverity.Low]: 'bg-severity-low/20 text-severity-low',
    };

    return (
        <>
            <tr className={!isExpanded && !isLast ? 'border-b border-gray-200 dark:border-auditor-border' : ''}>
                <td className="p-4 font-medium text-gray-900 dark:text-auditor-text-primary">{issue.title}</td>
                <td className="p-4">
                    <span className={`px-2 py-1 rounded-full font-semibold text-xs ${severityClasses[issue.severity]}`}>
                        {issue.severity}
                    </span>
                </td>
                <td className="p-4">
                    <span className="px-2 py-1 rounded-full font-semibold text-xs bg-status-open/20 text-status-open">
                        {issue.status}
                    </span>
                </td>
                <td className="p-4">
                    <button onClick={() => setIsExpanded(!isExpanded)} className="font-semibold text-auditor-primary hover:underline focus:outline-none">
                        {isExpanded ? 'Hide Details' : 'View Details'}
                    </button>
                </td>
            </tr>
            {isExpanded && (
                <tr className={!isLast ? 'border-b border-gray-200 dark:border-auditor-border' : ''}>
                    <td colSpan={4} className="p-4 pl-8 bg-gray-50 dark:bg-auditor-dark/50">
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-auditor-text-primary mb-1">Details</p>
                            <p className="text-sm text-gray-700 dark:text-auditor-text-secondary leading-relaxed">
                                {issue.description}
                            </p>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};
