
import React from 'react';
import { SnippetsIcon } from './icons';
import LockedFeatureCard from './LockedFeatureCard';

const AutomaticCodeFixes: React.FC = () => {
    return (
        <LockedFeatureCard
            icon={<SnippetsIcon className="h-6 w-6" />}
            title="Automatic Code Fixes"
            description="Upgrade to Pro to get automatically generated code fixes that you can apply with one click."
        />
    );
};

export default AutomaticCodeFixes;
