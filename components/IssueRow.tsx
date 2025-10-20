import React, { useState } from 'react';
import { Issue, IssueSeverity } from '../types';

interface IssueRowProps {
    issue: Issue;
    isLast: boolean;
    comparisonStatus?: 'new' | 'resolved';
}

const severityClasses: Record<IssueSeverity, { bg: string, text: string }> = {
    [IssueSeverity.HIGH]: { bg: 'bg-severity-high/10 dark:bg-severity-high/20', text: 'text-severity-high' },
    [IssueSeverity.MEDIUM]: { bg: 'bg-severity-medium/10 dark:bg-severity-medium/20', text: 'text-severity-medium' },
    [IssueSeverity.LOW]: { bg: 'bg-severity-low/10 dark:bg-severity-low/20', text: 'text-severity-low' },
};

export const IssueRow: React.FC<IssueRowProps> = ({ issue, isLast, comparisonStatus }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { title, severity, status, description, contextualSnippet, screenshotPlaceholderUrl } = issue;
    const severityClass = severityClasses[severity];
    
    const hasDetails = description || (contextualSnippet && contextualSnippet !== 'N/A') || (screenshotPlaceholderUrl && screenshotPlaceholderUrl !== 'N/A');

    return (
        <>
            <tr className={`${!isLast && !isExpanded ? 'border-b border-gray-200 dark:border-auditor-border' : ''}`}>
                <td className="p-4 font-medium text-gray-900 dark:text-auditor-text-primary align-top">
                    <div className="flex items-center space-x-2">
                        <span>{title}</span>
                        {comparisonStatus === 'new' && <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 dark:bg-auditor-primary/20 text-auditor-primary">New</span>}
                        {comparisonStatus === 'resolved' && <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 dark:bg-auditor-secondary/20 text-auditor-secondary">Resolved</span>}
                    </div>
                </td>
                <td className="p-4 align-top">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${severityClass.bg} ${severityClass.text}`}>
                        {severity}
                    </span>
                </td>
                <td className="p-4 text-gray-500 dark:text-auditor-text-secondary align-top">{status}</td>
                <td className="p-4 text-right align-top">
                    {hasDetails && (
                        <button onClick={() => setIsExpanded(!isExpanded)} className="text-sm font-medium text-auditor-primary hover:underline">
                            {isExpanded ? 'Hide Details' : 'View Details'}
                        </button>
                    )}
                </td>
            </tr>
            {isExpanded && hasDetails && (
                 <tr className={`${!isLast ? 'border-b border-gray-200 dark:border-auditor-border' : ''}`}>
                    <td colSpan={4} className="p-4 bg-gray-50 dark:bg-auditor-dark">
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-sm text-gray-900 dark:text-auditor-text-primary mb-1">Details</h4>
                                <p className="text-sm text-gray-600 dark:text-auditor-text-secondary">{description}</p>
                            </div>
                            {contextualSnippet && contextualSnippet !== 'N/A' && (
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-900 dark:text-auditor-text-primary mb-1">Contextual Snippet</h4>
                                    <pre className="bg-gray-200 dark:bg-auditor-border p-3 rounded-md text-xs text-gray-800 dark:text-auditor-text-primary overflow-x-auto whitespace-pre-wrap break-words">
                                        <code>{contextualSnippet}</code>
                                    </pre>
                                </div>
                            )}
                            {screenshotPlaceholderUrl && screenshotPlaceholderUrl !== 'N/A' && (
                                <div>
                                     <h4 className="font-semibold text-sm text-gray-900 dark:text-auditor-text-primary mb-1">Visual Context</h4>
                                     <img src={screenshotPlaceholderUrl} alt="Visual context for the issue" className="rounded-md border border-gray-300 dark:border-auditor-border max-w-sm"/>
                                </div>
                            )}
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};
