import React from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PillarCategory, AiGeneratedAudit } from '../types';
import { ExportIcon, ReportsIcon } from './icons';
import { IssueRow } from './IssueRow';

interface ReportsProps {
    auditResult: AiGeneratedAudit | null;
}

const Reports: React.FC<ReportsProps> = ({ auditResult }) => {
    
    if (!auditResult) {
        return (
            <div className="flex flex-col items-center justify-center text-center h-full max-w-md mx-auto">
                <div className="bg-auditor-primary/10 p-4 rounded-full mb-4">
                    <div className="bg-auditor-primary/20 p-3 rounded-full">
                       <ReportsIcon className="h-8 w-8 text-auditor-primary" />
                    </div>
                </div>
               <h2 className="text-xl font-semibold text-gray-900 dark:text-auditor-text-primary">No Report Available</h2>
               <p className="text-gray-500 dark:text-auditor-text-secondary mt-2">
                   Please run an audit from the dashboard to generate a report. Once an audit is complete, the full report will be displayed here.
               </p>
           </div>
        );
    }
    
    const { auditReport } = auditResult;
    const categories = Object.values(PillarCategory);

    const handleExportPDF = () => {
        const doc = new jsPDF();
        
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('Site Audit Report', 14, 22);
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text(`Overall Health Score: ${auditReport.score} / 100`, 14, 45);
        doc.text(`Total Pages Scanned: ${auditReport.scannedPages}`, 14, 52);

        let startY = 65;

        categories.forEach(category => {
            const categoryIssues = auditReport.issues.filter(issue => issue.category === category);
            if (categoryIssues.length === 0) return;

            const tableBody = categoryIssues.map(issue => [
                issue.title,
                issue.severity,
                issue.status
            ]);

            autoTable(doc, {
                head: [[`${category} Issues`]],
                body: [[{ content: '', styles: { cellPadding: 0, minCellHeight: 0 } }]],
                startY,
                theme: 'plain',
                headStyles: { fontSize: 16, fontStyle: 'bold', textColor: '#0D1117', fillColor: false }
            });
            
            const tableStartY = (doc as any).lastAutoTable.finalY - 5;

            autoTable(doc, {
                head: [['Issue', 'Severity', 'Status']],
                body: tableBody,
                startY: tableStartY,
                theme: 'grid',
                headStyles: { fillColor: [47, 129, 247], textColor: [255, 255, 255] },
                styles: { fontSize: 10 },
                columnStyles: { 0: { cellWidth: 100 }, 1: { cellWidth: 30 }, 2: { cellWidth: 30 } }
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
                        A comprehensive list of all {auditReport.issues.length} issues found during the audit.
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
                const categoryIssues = auditReport.issues.filter(issue => issue.category === category);
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

export default Reports;