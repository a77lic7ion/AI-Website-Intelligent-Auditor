
import React from 'react';
import { ExportIcon } from './icons';
import LockedFeatureCard from './LockedFeatureCard';

const DetailedPdfReports: React.FC = () => {
    return (
        <LockedFeatureCard
            icon={<ExportIcon className="h-6 w-6" />}
            title="Detailed PDF Reports"
            description="Upgrade to Pro to export detailed, shareable PDF reports of your website audits."
        />
    );
};

export default DetailedPdfReports;
