import React from 'react';
import { AuditReport } from '../types';
import { ReportsIcon } from './icons';

interface ReportsProps {
    reports: AuditReport[];
}

const Reports: React.FC<ReportsProps> = ({ reports }) => {
    if (reports.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <ReportsIcon className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-auditor-text-primary">No Reports Found</h2>
                <p className="text-gray-500 dark:text-auditor-text-secondary mt-2 max-w-md">You haven't run any audits yet. Start a new audit to see your reports here.</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-auditor-text-primary">Audit Reports</h1>
                <p className="text-gray-500 dark:text-auditor-text-secondary mt-1">A history of all the website audits you have performed.</p>
            </div>
            <div className="bg-white dark:bg-auditor-card border border-gray-200 dark:border-auditor-border rounded-lg shadow-sm overflow-x-auto">
                <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-auditor-border">
                    <thead className="bg-gray-50 dark:bg-auditor-dark">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-auditor-text-secondary uppercase tracking-wider">URL</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-auditor-text-secondary uppercase tracking-wider">Score</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-auditor-text-secondary uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-auditor-text-secondary uppercase tracking-wider">Provider</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">View</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-auditor-card divide-y divide-gray-200 dark:divide-auditor-border">
                        {reports.map((report) => (
                            <tr key={report.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900 dark:text-auditor-text-primary truncate" title={report.url}>{report.url}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${report.score > 89 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : report.score > 49 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
                                        {report.score}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-auditor-text-secondary">
                                    {new Date(report.timestamp).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-auditor-text-secondary">
                                    {report.provider}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-auditor-primary hover:underline">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Reports;
