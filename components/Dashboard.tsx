import React from 'react';
import ScoreGauge from './ScoreGauge';
import PrioritizedActionPlan from './PrioritizedActionPlan';
import SuggestedSnippets from './SuggestedSnippets';
import LivePreview from './LivePreview';
import LockedFeatureCard from './LockedFeatureCard';
import { AuditReport } from '../types';
import { GeminiIcon, GoogleIcon, ErrorIcon, PlusIcon, ActionPlanIcon, SnippetsIcon } from './icons';
import IssueRow from './IssueRow';

interface DashboardProps {
  latestReport: AuditReport | null;
  isLoading: boolean;
  error: string | null;
  onNewAuditClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ latestReport, isLoading, error, onNewAuditClick }) => {
    
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <GeminiIcon className="h-16 w-16 text-auditor-primary animate-spin mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-auditor-text-primary">Auditing in Progress...</h2>
                <p className="text-gray-500 dark:text-auditor-text-secondary mt-2 max-w-md">Gemini is analyzing the website. This might take a moment. We're checking for accessibility, performance, SEO, and more.</p>
            </div>
        );
    }
    
    if (error) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-lg p-8">
                <ErrorIcon className="h-12 w-12 text-severity-high mb-4" />
                <h2 className="text-xl font-semibold text-severity-high">Audit Failed</h2>
                <p className="text-red-700 dark:text-red-300 mt-2 mb-6 max-w-md">{error}</p>
                 <button onClick={onNewAuditClick} className="flex items-center space-x-2 bg-auditor-primary hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                    <PlusIcon className="h-5 w-5" />
                    <span>Try Another Audit</span>
                </button>
            </div>
        );
    }

    if (!latestReport) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                 <GoogleIcon className="h-16 w-16 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-auditor-text-primary">Ready to start your first audit?</h2>
                <p className="text-gray-500 dark:text-auditor-text-secondary mt-2 max-w-md">Click the button below to analyze a website and get actionable insights to improve its quality.</p>
                <button onClick={onNewAuditClick} className="mt-6 flex items-center space-x-2 bg-auditor-primary hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                    <PlusIcon className="h-5 w-5" />
                    <span>Start New Audit</span>
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Top Row: Score and Live Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-white dark:bg-auditor-card border border-gray-200 dark:border-auditor-border rounded-lg p-6 flex flex-col items-center justify-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-auditor-text-primary mb-4">Overall Score</h3>
                    <ScoreGauge score={latestReport.score} />
                    <p className="text-sm text-gray-500 dark:text-auditor-text-secondary mt-4 text-center">For <a href={latestReport.url} target="_blank" rel="noreferrer" className="font-medium text-auditor-primary hover:underline">{latestReport.url}</a></p>
                </div>
                <div className="lg:col-span-2">
                    <LivePreview url={latestReport.url} />
                </div>
            </div>

            {/* Middle Row: Action Plan and Snippets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <PrioritizedActionPlan plan={latestReport.actionPlan} />
                 <SuggestedSnippets snippets={latestReport.snippets} />
            </div>
            
            {/* Bottom Row: Full Report and Locked Features */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-auditor-card border border-gray-200 dark:border-auditor-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-auditor-text-primary mb-4">Audit Breakdown</h3>
                    <div className="space-y-4">
                        {latestReport.issues.map((issue, index) => (
                           <IssueRow key={index} issue={issue} />
                        ))}
                    </div>
                </div>
                <div className="space-y-6">
                   <LockedFeatureCard title="Automatic Code Fixes" description="Automatically apply suggested fixes to your codebase via a GitHub integration." icon={<ActionPlanIcon className="h-6 w-6" />} />
                   <LockedFeatureCard title="In-depth PDF Reports" description="Export detailed, shareable PDF reports of your audits for stakeholders." icon={<SnippetsIcon className="h-6 w-6" />} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
