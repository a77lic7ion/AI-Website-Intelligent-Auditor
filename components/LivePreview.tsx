import React from 'react';

interface LivePreviewProps {
    url: string;
}

const LivePreview: React.FC<LivePreviewProps> = ({ url }) => {
    return (
        <div className="bg-white dark:bg-auditor-card border border-gray-200 dark:border-auditor-border rounded-lg h-full flex flex-col min-h-[400px]">
            <div className="p-4 border-b border-gray-200 dark:border-auditor-border">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-auditor-text-primary">Live Preview</h3>
            </div>
            <div className="flex-grow bg-gray-100 dark:bg-auditor-dark p-4 rounded-b-lg">
                <div className="w-full h-full bg-white dark:bg-auditor-card rounded-md shadow-inner overflow-hidden">
                    <iframe 
                        src={url} 
                        title="Website Preview"
                        className="w-full h-full border-0"
                        sandbox="allow-scripts allow-same-origin" // for security
                    />
                </div>
            </div>
        </div>
    );
};

export default LivePreview;
