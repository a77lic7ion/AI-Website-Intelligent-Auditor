import React from 'react';
import { AiGeneratedAudit, User } from '../types';
import ScoreGauge from './ScoreGauge';
import LockedFeatureCard from './LockedFeatureCard';
import PrioritizedActionPlan from './PrioritizedActionPlan';
import SuggestedSnippets from './SuggestedSnippets';
import { GeminiIcon, PlusIcon } from './icons';
import { IssueRow } from './IssueRow';

interface DashboardProps {
    currentUser: User;
    auditedUrl: string;
    auditResult: AiGeneratedAudit | null;
    isAuditing: boolean;
    auditError: string | null;
    onNewAuditClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, auditedUrl, auditResult, isAuditing, auditError, onNewAuditClick }) => {
    
    if (isAuditing) {
        return <LoadingState />;
    }

    if (auditError) {
        return <ErrorState message={auditError} onRetryClick={onNewAuditClick} />;
    }
    
    if (!auditResult || !auditedUrl) {
        return <InitialState onNewAuditClick={onNewAuditClick} />;
    }

    const { auditReport, aiAnalysis } = auditResult;
    const criticalIssues = auditReport.issues.filter(issue => issue.severity === 'High' || issue.severity === 'Medium').slice(0, 3);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Website Health Score */}
                <div className="lg:col-span-1 bg-white dark:bg-auditor-card border border-gray-200 dark:border-auditor-border rounded-lg p-6 flex flex-col items-center justify-center text-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-auditor-text-primary mb-2">Website Health Score</h3>
                    <p className="text-sm text-auditor-text-secondary mb-3 truncate w-full px-4" title={auditedUrl}>{auditedUrl}</p>
                    <ScoreGauge score={auditReport.score} />
                    <p className="mt-4 text-gray-500 dark:text-auditor-text-secondary text-sm">Based on {auditReport.issues.length} issues found.</p>
                </div>

                {/* Gemini API Summary */}
                <div className="lg:col-span-2 bg-white dark:bg-auditor-card border border-gray-200 dark:border-auditor-border rounded-lg p-6">
                    <div className="flex items-center space-x-2 text-gray-900 dark:text-auditor-text-primary mb-3">
                        <GeminiIcon className="h-6 w-6 text-auditor-primary"/>
                        <h3 className="text-lg font-semibold">Gemini API Summary</h3>
                    </div>
                    <p className="text-gray-500 dark:text-auditor-text-secondary text-sm leading-relaxed">{aiAnalysis.summary}</p>
                    {!currentUser.isPro && (
                        <div className="mt-4 p-3 bg-auditor-primary/10 rounded-lg flex items-center space-x-3">
                            <input type="radio" checked readOnly className="form-radio h-4 w-4 text-auditor-primary bg-gray-100 dark:bg-auditor-card border-gray-300 dark:border-auditor-border" />
                            <label className="text-sm text-gray-500 dark:text-auditor-text-secondary">
                                <span className="font-semibold text-gray-900 dark:text-auditor-text-primary">Paid Feature:</span> Get a detailed, line-by-line breakdown and actionable insights.
                            </label>
                        </div>
                    )}
                </div>
            </div>

            {/* Critical Issues */}
            <div className="bg-white dark:bg-auditor-card border border-gray-200 dark:border-auditor-border rounded-lg">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-auditor-text-primary">Critical Issues</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="text-left text-gray-500 dark:text-auditor-text-secondary">
                            <tr className="border-b border-gray-200 dark:border-auditor-border">
                                <th className="font-semibold p-4">Issue</th>
                                <th className="font-semibold p-4">Severity</th>
                                <th className="font-semibold p-4">Status</th>
                                <th className="font-semibold p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {criticalIssues.map((issue, index) => (
                                <IssueRow key={issue.id} issue={issue} isLast={index === criticalIssues.length - 1} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* AI-Powered Solutions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {currentUser.isPro && aiAnalysis ? (
                    <PrioritizedActionPlan plan={aiAnalysis.prioritizedActionPlan} />
                ) : (
                    <LockedFeatureCard 
                        title="Prioritized Action Plan" 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>}
                        description="AI-generated step-by-step plan to tackle the most critical issues first, saving you time and effort."
                    />
                )}
                {currentUser.isPro && aiAnalysis ? (
                    <SuggestedSnippets snippets={aiAnalysis.suggestedSnippets} />
                ) : (
                    <LockedFeatureCard
                        title="Suggested HTML Snippets"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>}
                        description="Get auto-generated code snippets to fix issues like missing meta tags, incorrect schema, and more."
                    />
                )}
            </div>
        </div>
    );
};

const InitialState: React.FC<{onNewAuditClick: () => void}> = ({ onNewAuditClick }) => (
    <div className="flex flex-col items-center justify-center text-center h-full max-w-md mx-auto">
         <div className="bg-auditor-primary/10 p-4 rounded-full mb-4">
             <div className="bg-auditor-primary/20 p-3 rounded-full">
                <GeminiIcon className="h-8 w-8 text-auditor-primary" />
             </div>
         </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-auditor-text-primary">Welcome to Site Auditor</h2>
        <p className="text-gray-500 dark:text-auditor-text-secondary mt-2 mb-6">
            Get started by running your first AI-powered website audit. Enter a URL to receive a comprehensive analysis of its performance, SEO, accessibility, and more.
        </p>
        <button onClick={onNewAuditClick} className="flex items-center space-x-2 bg-auditor-primary hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
            <PlusIcon className="h-5 w-5" />
            <span>Start Your First Audit</span>
        </button>
    </div>
);

const LoadingState = () => (
    <div className="flex flex-col items-center justify-center text-center h-full">
        <GeminiIcon className="h-12 w-12 text-auditor-primary animate-spin" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-auditor-text-primary mt-4">Analyzing Website...</h2>
        <p className="text-gray-500 dark:text-auditor-text-secondary mt-2">
            The Gemini API is generating your comprehensive audit. This may take a moment.
        </p>
    </div>
);

const ErrorState: React.FC<{ message: string; onRetryClick: () => void }> = ({ message, onRetryClick }) => (
     <div className="flex flex-col items-center justify-center text-center h-full max-w-md mx-auto bg-white dark:bg-auditor-card border border-red-500/30 dark:border-severity-high/50 rounded-lg p-8">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-severity-high mb-4"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-auditor-text-primary">Audit Failed</h2>
        <p className="text-gray-500 dark:text-auditor-text-secondary mt-2 mb-6">
            {message}
        </p>
        <button onClick={onRetryClick} className="flex items-center space-x-2 bg-auditor-primary hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
            <span>Try a New Audit</span>
        </button>
    </div>
);

export default Dashboard;