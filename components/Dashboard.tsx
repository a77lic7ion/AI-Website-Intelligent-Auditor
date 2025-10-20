
import React, { useState, useEffect } from 'react';
import { AuditReport, Issue } from '../types';
import ScoreGauge from './ScoreGauge';
import IssueRow from './IssueRow';
import PrioritizedActionPlan from './PrioritizedActionPlan';
import SuggestedSnippets from './SuggestedSnippets';
import LivePreview from './LivePreview';
import AutomaticCodeFixes from './AutomaticCodeFixes';
import DetailedPdfReports from './DetailedPdfReports';
import { GeminiIcon } from './icons';

interface DashboardProps {
    latestReport: AuditReport | null;
    onNewAuditClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ latestReport, onNewAuditClick }) => {
    const [issues, setIssues] = useState<Issue[]>([]);

    useEffect(() => {
        setIssues(latestReport?.reportData.issues.map(i => ({...i, isExpanded: false})) || []);
    }, [latestReport]);


    const handleToggleIssue = (id: string) => {
        setIssues(prevIssues => 
            prevIssues.map(issue => 
                issue.id === id ? { ...issue, isExpanded: !issue.isExpanded } : issue
            )
        );
    };

    if (!latestReport) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <GeminiIcon className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-auditor-text-primary">Welcome to Site Auditor</h2>
                <p className="text-gray-500 dark:text-auditor-text-secondary mt-2 max-w-md">Start by running your first website audit to see a detailed analysis of its performance, SEO, and accessibility.</p>
                <button 
                    onClick={onNewAuditClick} 
                    className="mt-6 bg-auditor-primary hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                    Run First Audit
                </button>
            </div>
        );
    }

    const { url, reportData } = latestReport;

    return (
        <div className="space-y-8">
            {/* Top Row: Score and Live Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white dark:bg-auditor-card border border-gray-200 dark:border-auditor-border rounded-lg p-6 flex flex-col items-center justify-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-auditor-text-primary mb-4">Overall Score</h3>
                    <ScoreGauge score={reportData.score} />
                    <p className="text-sm text-gray-500 dark:text-auditor-text-secondary mt-4 text-center">Based on an analysis of performance, accessibility, and SEO.</p>
                </div>
                <div className="lg:col-span-2">
                    <LivePreview url={url} />
                </div>
            </div>

            {/* Issues Table */}
             <div className="bg-white dark:bg-auditor-card border border-gray-200 dark:border-auditor-border rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-200 dark:border-auditor-border">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-auditor-text-primary">Detected Issues</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-auditor-border">
                        <thead className="bg-gray-50 dark:bg-auditor-dark/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-auditor-text-secondary uppercase tracking-wider">Issue</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-auditor-text-secondary uppercase tracking-wider">Severity</th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Expand</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-auditor-card divide-y divide-gray-200 dark:divide-auditor-border">
                            {issues.map((issue) => (
                                <IssueRow key={issue.id} issue={issue} onToggle={handleToggleIssue} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
             {/* Middle Row: Action Plan and Snippets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PrioritizedActionPlan plan={reportData.actionPlan} />
                <SuggestedSnippets snippets={reportData.snippets} />
            </div>

            {/* Bottom Row: Pro Features */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AutomaticCodeFixes />
                <DetailedPdfReports />
            </div>
        </div>
    );
};

export default Dashboard;
