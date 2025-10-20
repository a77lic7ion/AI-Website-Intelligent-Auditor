import React from 'react';
import { AiGeneratedAudit, User, AuditError } from '../types';
import ScoreGauge from './ScoreGauge';
import LockedFeatureCard from './LockedFeatureCard';
import PrioritizedActionPlan from './PrioritizedActionPlan';
import SuggestedSnippets from './SuggestedSnippets';
import { 
    GeminiIcon, 
    PlusIcon, 
    SaveIcon, 
    ArrowUpIcon, 
    ArrowDownIcon, 
    PlusCircleIcon, 
    CheckCircleIcon,
    ActionPlanIcon,
    SnippetsIcon,
    ErrorIcon
} from './icons';
import { IssueRow } from './IssueRow';

interface DashboardProps {
    currentUser: User;
    auditedUrl: string;
    auditResult: AiGeneratedAudit | null;
    isAuditing: boolean;
    auditError: AuditError | null;
    onNewAuditClick: () => void;
    onSaveReport: () => void;
    comparisonResult: AiGeneratedAudit | null;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, auditedUrl, auditResult, isAuditing, auditError, onNewAuditClick, onSaveReport, comparisonResult }) => {
    
    if (isAuditing) {
        return <LoadingState />;
    }

    if (auditError) {
        return <ErrorState error={auditError} onRetryClick={onNewAuditClick} />;
    }
    
    if (!auditResult || !auditedUrl) {
        return <InitialState onNewAuditClick={onNewAuditClick} />;
    }

    const { auditReport, aiAnalysis } = auditResult;
    const criticalIssues = auditReport.issues.filter(issue => issue.severity === 'High' || issue.severity === 'Medium').slice(0, 3);

    return (
        <div className="space-y-8">
             <div className="flex justify-between items-center">
                <div>
                    {/* Placeholder for potential future actions */}
                </div>
                <button 
                    onClick={onSaveReport} 
                    className="flex items-center space-x-2 text-sm font-semibold text-auditor-primary hover:underline"
                >
                    <SaveIcon className="h-4 w-4" />
                    <span>Save Report</span>
                </button>
            </div>
            {comparisonResult && <ComparisonSummary current={auditResult} previous={comparisonResult} />}
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
                        <h3 className="text-lg font-semibold">AI Summary</h3>
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
                        icon={<ActionPlanIcon className="h-6 w-6" />}
                        description="AI-generated step-by-step plan to tackle the most critical issues first, saving you time and effort."
                    />
                )}
                {currentUser.isPro && aiAnalysis ? (
                    <SuggestedSnippets snippets={aiAnalysis.suggestedSnippets} />
                ) : (
                    <LockedFeatureCard
                        title="Suggested HTML Snippets"
                        icon={<SnippetsIcon className="h-6 w-6" />}
                        description="Get auto-generated code snippets to fix issues like missing meta tags, incorrect schema, and more."
                    />
                )}
            </div>
        </div>
    );
};

const ComparisonSummary: React.FC<{current: AiGeneratedAudit, previous: AiGeneratedAudit}> = ({ current, previous }) => {
    const scoreDiff = current.auditReport.score - previous.auditReport.score;
    const previousIssueIds = new Set(previous.auditReport.issues.map(i => i.id));
    const currentIssueIds = new Set(current.auditReport.issues.map(i => i.id));
    
    const newIssues = current.auditReport.issues.filter(i => !previousIssueIds.has(i.id)).length;
    const resolvedIssues = previous.auditReport.issues.filter(i => !currentIssueIds.has(i.id)).length;

    return (
        <div className="bg-white dark:bg-auditor-card border border-gray-200 dark:border-auditor-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-auditor-text-primary mb-4">Comparison to Last Report</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                    <div className={`flex items-center justify-center text-2xl font-bold ${scoreDiff > 0 ? 'text-auditor-secondary' : scoreDiff < 0 ? 'text-severity-high' : 'text-auditor-text-primary'}`}>
                        {scoreDiff > 0 && <ArrowUpIcon className="h-5 w-5 mr-1" />}
                        {scoreDiff < 0 && <ArrowDownIcon className="h-5 w-5 mr-1" />}
                        {scoreDiff > 0 ? '+' : ''}{scoreDiff}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-auditor-text-secondary mt-1">Score Change</p>
                </div>
                 <div>
                    <p className="text-2xl font-bold text-auditor-text-primary">{current.auditReport.issues.length}</p>
                    <p className="text-sm text-gray-500 dark:text-auditor-text-secondary mt-1">Total Issues</p>
                </div>
                <div>
                    <div className="flex items-center justify-center text-2xl font-bold text-severity-high">
                        <PlusCircleIcon className="h-5 w-5 mr-1" />
                        {newIssues}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-auditor-text-secondary mt-1">New Issues</p>
                </div>
                <div>
                    <div className="flex items-center justify-center text-2xl font-bold text-auditor-secondary">
                        <CheckCircleIcon className="h-5 w-5 mr-1" />
                        {resolvedIssues}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-auditor-text-secondary mt-1">Resolved Issues</p>
                </div>
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
            The AI is generating your comprehensive audit. This may take a moment.
        </p>
    </div>
);

const ErrorState: React.FC<{ error: AuditError; onRetryClick: () => void }> = ({ error, onRetryClick }) => {
    const getGuidance = () => {
        switch (error.type) {
            case 'api_key':
                return <>Please verify your API Key in the <a href="#" onClick={(e) => { e.preventDefault(); /* This should navigate to settings */}} className="font-semibold underline hover:text-auditor-primary">Settings page</a> or try a different AI provider.</>;
            case 'url_fetch':
                 return "The URL could not be reached. Please check if the URL is correct, publicly accessible, and not blocking automated requests.";
            case 'network':
                return "A network connection could not be established. Please check your internet connection and any firewall or proxy settings.";
            case 'safety':
                return "The request was blocked by the AI provider's safety filters. This can happen with sensitive or controversial topics. Please try a different URL.";
            case 'parsing':
                return "The AI provider returned an unexpected response that could not be read. This may be a temporary issue. Trying again may help.";
            default:
                return "An unexpected error occurred. Check the developer console for more technical details.";
        }
    }
    
    return (
     <div className="flex flex-col items-center justify-center text-center h-full max-w-md mx-auto bg-white dark:bg-auditor-card border border-red-500/30 dark:border-severity-high/50 rounded-lg p-8">
        <ErrorIcon className="h-12 w-12 text-severity-high mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-auditor-text-primary">Audit Failed</h2>
        <p className="text-gray-500 dark:text-auditor-text-secondary mt-2 mb-2 font-medium">{error.message}</p>
        <p className="text-gray-500 dark:text-auditor-text-secondary mt-1 mb-6 text-sm">
            {getGuidance()}
        </p>
        <button onClick={onRetryClick} className="flex items-center space-x-2 bg-auditor-primary hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
            <span>Try a New Audit</span>
        </button>
    </div>
    );
};

export default Dashboard;