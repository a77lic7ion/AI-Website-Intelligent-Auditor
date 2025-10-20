
import React, { useState, useEffect } from 'react';
import { MOCK_AUDIT_REPORT } from '../constants';
import { AiAnalysis, AuditReport, Issue, IssueSeverity, User } from '../types';
import ScoreGauge from './ScoreGauge';
import LockedFeatureCard from './LockedFeatureCard';
import PrioritizedActionPlan from './PrioritizedActionPlan';
import SuggestedSnippets from './SuggestedSnippets';
import { getAuditAnalysis } from '../geminiService';
import { GeminiIcon } from './icons';


interface DashboardProps {
    currentUser: User;
    auditTrigger: number;
    auditedUrl: string;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, auditTrigger, auditedUrl }) => {
    const [report] = useState<AuditReport>(MOCK_AUDIT_REPORT);
    const [analysis, setAnalysis] = useState<AiAnalysis | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchAnalysis = async () => {
            setLoading(true);
            setAnalysis(null);
            try {
                // In a real app, you'd pass the auditedUrl to the service
                const result = await getAuditAnalysis(report, auditedUrl);
                setAnalysis(result);
            } catch (error) {
                console.error("Failed to get AI analysis:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalysis();
    }, [report, auditTrigger, auditedUrl]);

    const criticalIssues = report.issues.filter(issue => issue.severity === IssueSeverity.High || issue.severity === IssueSeverity.Medium).slice(0, 3);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Website Health Score */}
                <div className="lg:col-span-1 bg-white dark:bg-auditor-card border border-gray-200 dark:border-auditor-border rounded-lg p-6 flex flex-col items-center justify-center text-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-auditor-text-primary mb-2">Website Health Score</h3>
                    <ScoreGauge score={report.score} />
                    <p className="mt-4 text-gray-500 dark:text-auditor-text-secondary text-sm">A good score, but there's room for improvement.</p>
                </div>

                {/* Gemini API Summary */}
                <div className="lg:col-span-2 bg-white dark:bg-auditor-card border border-gray-200 dark:border-auditor-border rounded-lg p-6">
                    <div className="flex items-center space-x-2 text-gray-900 dark:text-auditor-text-primary mb-3">
                        <GeminiIcon className="h-6 w-6 text-auditor-primary"/>
                        <h3 className="text-lg font-semibold">Gemini API Summary</h3>
                    </div>
                    {loading ? (
                         <div className="space-y-3 animate-pulse">
                            <div className="h-4 bg-gray-200 dark:bg-auditor-border rounded w-full"></div>
                            <div className="h-4 bg-gray-200 dark:bg-auditor-border rounded w-5/6"></div>
                            <div className="h-4 bg-gray-200 dark:bg-auditor-border rounded w-3/4"></div>
                         </div>
                    ) : (
                        <p className="text-gray-500 dark:text-auditor-text-secondary text-sm leading-relaxed">{analysis?.summary}</p>
                    )}
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
                {currentUser.isPro && analysis ? (
                    <PrioritizedActionPlan plan={analysis.prioritizedActionPlan} />
                ) : (
                    <LockedFeatureCard 
                        title="Prioritized Action Plan" 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>}
                        description="AI-generated step-by-step plan to tackle the most critical issues first, saving you time and effort."
                    />
                )}
                {currentUser.isPro && analysis ? (
                    <SuggestedSnippets snippets={analysis.suggestedSnippets} />
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

const IssueRow: React.FC<{ issue: Issue; isLast: boolean }> = ({ issue, isLast }) => {
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

export default Dashboard;
