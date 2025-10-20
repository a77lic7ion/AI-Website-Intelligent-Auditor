import React, { useState } from 'react';
import { SnippetsIcon, CopyIcon, CheckIcon } from './icons';

interface Snippet {
    title: string;
    description: string;
    code: string;
    language: string;
}

interface SuggestedSnippetsProps {
    snippets: Snippet[];
}

const SuggestedSnippets: React.FC<SuggestedSnippetsProps> = ({ snippets }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!snippets || snippets.length === 0) {
        return (
            <div className="bg-white dark:bg-auditor-card border border-gray-200 dark:border-auditor-border rounded-lg p-6 h-full flex flex-col">
                <div className="flex items-center space-x-3 text-gray-900 dark:text-auditor-text-primary mb-2">
                     <SnippetsIcon className="h-6 w-6" />
                    <h3 className="text-lg font-semibold">Suggested HTML Snippets</h3>
                </div>
                 <p className="text-gray-500 dark:text-auditor-text-secondary text-sm flex-grow">No code snippets suggested for the current issues.</p>
            </div>
        );
    }
    
    const snippet = snippets[0]; // Assuming one for now for simplicity

    return (
        <div className="bg-white dark:bg-auditor-card border border-gray-200 dark:border-auditor-border rounded-lg p-6 h-full flex flex-col">
            <div className="flex items-center space-x-3 text-gray-900 dark:text-auditor-text-primary mb-2">
                 <SnippetsIcon className="h-6 w-6" />
                <h3 className="text-lg font-semibold">{snippet.title}</h3>
            </div>
            <p className="text-gray-500 dark:text-auditor-text-secondary text-sm flex-grow mb-4">{snippet.description}</p>
            <div className="bg-gray-100 dark:bg-auditor-dark rounded-md relative group">
                <button 
                    onClick={() => handleCopy(snippet.code)}
                    className="absolute top-2 right-2 p-1.5 bg-gray-200 dark:bg-auditor-border rounded-md text-gray-600 dark:text-auditor-text-secondary hover:bg-gray-300 dark:hover:bg-auditor-border/70 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    {copied ? (
                        <CheckIcon className="h-4 w-4" />
                    ) : (
                        <CopyIcon className="h-4 w-4" />
                    )}
                </button>
                <pre className="p-4 overflow-x-auto text-sm">
                    <code className={`language-${snippet.language}`}>{snippet.code}</code>
                </pre>
            </div>
        </div>
    );
};

export default SuggestedSnippets;