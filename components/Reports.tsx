import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { PillarCategory, AiGeneratedAudit } from '../types';
import { ExportIcon, ReportsIcon } from './icons';
import { IssueRow } from './IssueRow';

interface ReportsProps {
    auditResult: AiGeneratedAudit | null;
}

const Reports: React.FC<ReportsProps> = ({ auditResult }) => {
    const [isExporting, setIsExporting] = useState(false);
    
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

    const handleExportPDF = async () => {
        setIsExporting(true);

        const doc = new jsPDF();
        const pageMargin = 14;
        const pageWidth = doc.internal.pageSize.getWidth();
        const contentWidth = pageWidth - (pageMargin * 2);
        let currentY = 0;

        // --- PDF Header ---
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('Site Audit Report', pageMargin, 22);
        currentY = 30;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageMargin, currentY);
        currentY += 15;

        // --- Summary ---
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text(`Overall Health Score: ${auditReport.score} / 100`, pageMargin, currentY);
        currentY += 7;
        doc.text(`Total Pages Scanned: ${auditReport.scannedPages}`, pageMargin, currentY);
        currentY += 15;

        // --- Issues Loop ---
        for (const category of categories) {
            const categoryIssues = auditReport.issues.filter(issue => issue.category === category);
            if (categoryIssues.length === 0) continue;
            
            if (currentY > 260) {
                doc.addPage();
                currentY = 22;
            }

            // Category Header
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text(category, pageMargin, currentY);
            doc.setLineWidth(0.5);
            doc.line(pageMargin, currentY + 2, pageWidth - pageMargin, currentY + 2);
            currentY += 12;

            for (const issue of categoryIssues) {
                const descriptionLines = doc.splitTextToSize(issue.description, contentWidth).length;
                let snippetLines = 0;
                if (issue.contextualSnippet && issue.contextualSnippet !== 'N/A') {
                    snippetLines = doc.splitTextToSize(issue.contextualSnippet, contentWidth).length;
                }
                const estimatedHeight = (descriptionLines + snippetLines) * 5 + 30;
                
                if (currentY + estimatedHeight > 280) {
                     doc.addPage();
                     currentY = 22;
                }

                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.text(issue.title, pageMargin, currentY);
                currentY += 6;

                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text(`Severity: ${issue.severity}  |  Status: ${issue.status}`, pageMargin, currentY);
                currentY += 8;

                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text('Description', pageMargin, currentY);
                currentY += 5;
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);
                const descText = doc.splitTextToSize(issue.description, contentWidth);
                doc.text(descText, pageMargin, currentY);
                currentY += descText.length * 4 + 4;

                if (issue.contextualSnippet && issue.contextualSnippet !== 'N/A') {
                    doc.setFontSize(12);
                    doc.setFont('helvetica', 'bold');
                    doc.text('Contextual Snippet', pageMargin, currentY);
                    currentY += 5;

                    doc.setFillColor(240, 240, 240);
                    const snippetText = doc.splitTextToSize(issue.contextualSnippet, contentWidth - 4);
                    const snippetHeight = snippetText.length * 3.5 + 4;
                    doc.rect(pageMargin, currentY - 3, contentWidth, snippetHeight, 'F');
                    
                    doc.setFont('courier', 'normal');
                    doc.setFontSize(9);
                    doc.setTextColor(50);
                    doc.text(snippetText, pageMargin + 2, currentY);
                    currentY += snippetHeight + 2;
                }
                
                doc.setDrawColor(200);
                doc.setLineWidth(0.2);
                doc.line(pageMargin, currentY, pageWidth - pageMargin, currentY);
                currentY += 8;
            }
        }

        doc.save('Comprehensive-Site-Audit-Report.pdf');
        setIsExporting(false);
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
                    disabled={isExporting}
                    className="flex items-center space-x-2 bg-auditor-primary hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                    <ExportIcon className="h-5 w-5" />
                    <span>{isExporting ? 'Exporting...' : 'Export as PDF'}</span>
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