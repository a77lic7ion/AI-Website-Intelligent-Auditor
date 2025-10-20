import React from 'react';
import { ExportIcon } from './icons';
import LockedFeatureCard from './LockedFeatureCard';

interface DetailedPdfReportsProps {
    isUnlocked: boolean;
}

const DetailedPdfReports: React.FC<DetailedPdfReportsProps> = ({ isUnlocked }) => {
    if (!isUnlocked) {
        return (
            <LockedFeatureCard
                icon={<ExportIcon className="h-6 w-6" />}
                title="Detailed PDF Reports"
                description="Upgrade to Pro to export detailed, shareable PDF reports of your website audits."
            />
        );
    }

    return (
         <div className="bg-white dark:bg-auditor-card border border-gray-200 dark:border-auditor-border rounded-lg p-6 flex flex-col h-full">
            <div className="flex items-start space-x-3 text-gray-900 dark:text-auditor-text-primary mb-2">
                <ExportIcon className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Detailed PDF Reports</h3>
            </div>
            <p className="text-gray-500 dark:text-auditor-text-secondary text-sm flex-grow">Export a comprehensive, shareable PDF of your full audit report, including all findings and recommendations.</p>
            <button className="mt-4 flex items-center justify-center space-x-2 bg-auditor-primary hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                <ExportIcon className="h-5 w-5" />
                <span>Export as PDF</span>
            </button>
        </div>
    );
};

export default DetailedPdfReports;
