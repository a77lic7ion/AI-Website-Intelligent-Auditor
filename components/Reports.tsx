
import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MOCK_AUDIT_REPORT } from '../constants';
import { PillarCategory, Issue, IssueSeverity } from '../types';
import { ExportIcon } from './icons';

const Reports: React.FC = () => {
    const report = MOCK_AUDIT_REPORT;
    const categories = Object.values(PillarCategory);

    const handleExportPDF = () => {
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('Site Audit Report', 14, 22);
        
        // Sub-header
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

        // Summary Stats
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text(`Overall Health Score: ${report.score} / 100`, 14, 45);
        doc.text(`Total Pages Scanned: ${report.scannedPages}`, 14, 52);

        let startY = 65;

        categories.forEach(category => {
            const categoryIssues = report.issues.filter(issue => issue.category === category);
            if (categoryIssues.length === 0) {
                return;
            }

            const tableBody = categoryIssues.map(issue => [
                issue.title,
                issue.severity,
                issue.status
            ]);

            autoTable(doc, {
                head: [[`${category} Issues`]],
                body: [
                    [{ content: '', styles: { cellPadding: 0, minCellHeight: 0 } }]
                ],
                startY,
                theme: 'plain',
                headStyles: {
                    fontSize: 16,
                    fontStyle: 'bold',
                    textColor: '#0D1117',
                    fillColor: false
                }
            });
            
            const tableStartY = (doc as any).lastAutoTable.finalY - 5;

            autoTable(doc, {
                head: [['Issue', 'Severity', 'Status']],
                body: tableBody,
                startY: tableStartY,
                theme: 'grid',
                headStyles: {
                    fillColor: [47, 129, 247], // auditor-primary color
                    textColor: [255, 255, 255],
                },
                styles: {
                    fontSize: 10,
                },
                columnStyles: {
                    0: { cellWidth: 100 },
                    1: { cellWidth: 30 },
                    2: { cellWidth: 30 },
                }
            });

            startY = (doc as any).lastAutoTable.finalY + 15;
        });

        doc.save('Site-Audit-Report.pdf');
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-auditor-text-primary">Full Audit Report</h1>
                    <p className="text-gray-500 dark:text-auditor-text-secondary mt-1">
                        A comprehensive list of all issues found during the audit.
                    </p>
                </div>
                <button 
                    onClick={handleExportPDF}
                    className="flex items-center space-x-2 bg-auditor-primary hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                    <ExportIcon className="h-5 w-5" />
                    <span>Export as PDF</span>
                </button>
            </div>

            {categories.map(category => {
                const categoryIssues = report.issues.filter(issue => issue.category === category);
                if (categoryIssues.length === 0) return null;

                return (
                    <div key={category} className="bg-white dark:bg-auditor-card border border-gray-200 dark:border-auditor-border rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-auditor-text-primary">{category}</h3>
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
                                    {categoryIssues.map((issue, index) => (
                                        <IssueRow key={issue.id} issue={issue} isLast={index === categoryIssues.length - 1} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            })}
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


export default Reports;
