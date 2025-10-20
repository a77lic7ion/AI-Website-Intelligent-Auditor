import React, { useState, useEffect } from 'react';
import { CloseIcon } from './icons';
import { AiProvider } from '../types';

interface NewAuditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStartAudit: (url: string, provider: AiProvider) => void;
}

const NewAuditModal: React.FC<NewAuditModalProps> = ({ isOpen, onClose, onStartAudit }) => {
    const [url, setUrl] = useState('');
    const [provider, setProvider] = useState<AiProvider>(AiProvider.GEMINI);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setUrl(''); // Reset URL when modal opens
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;
        setIsLoading(true);

        // Simulate a slight delay for starting the audit
        setTimeout(() => {
            onStartAudit(url, provider);
            setIsLoading(false);
        }, 500);
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-auditor-card w-full max-w-lg rounded-lg shadow-xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-auditor-border">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-auditor-text-primary">Start a New Website Audit</h2>
                        <p className="text-sm text-gray-500 dark:text-auditor-text-secondary mt-1">Enter a URL and select an AI provider to analyze.</p>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 dark:text-auditor-text-secondary hover:bg-gray-100 dark:hover:bg-auditor-border">
                        <CloseIcon className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                         <div>
                            <label htmlFor="audit-url" className="block text-sm font-medium text-gray-500 dark:text-auditor-text-secondary mb-2">Website URL</label>
                            <input
                                id="audit-url"
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com"
                                required
                                autoFocus
                                className="w-full bg-gray-50 dark:bg-auditor-dark border border-gray-300 dark:border-auditor-border rounded-md px-3 py-2 text-gray-900 dark:text-auditor-text-primary focus:outline-none focus:ring-2 focus:ring-auditor-primary"
                            />
                        </div>
                        <div>
                            <label htmlFor="ai-provider" className="block text-sm font-medium text-gray-500 dark:text-auditor-text-secondary mb-2">AI Provider</label>
                            <select
                                id="ai-provider"
                                value={provider}
                                onChange={(e) => setProvider(e.target.value as AiProvider)}
                                className="w-full bg-gray-50 dark:bg-auditor-dark border border-gray-300 dark:border-auditor-border rounded-md px-3 py-2 text-gray-900 dark:text-auditor-text-primary focus:outline-none focus:ring-2 focus:ring-auditor-primary"
                            >
                                {/* Fix: Cast Object.values to AiProvider[] to resolve typing issues */}
                                {(Object.values(AiProvider) as AiProvider[]).map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end items-center p-6 bg-gray-50 dark:bg-auditor-dark/50 border-t border-gray-200 dark:border-auditor-border rounded-b-lg">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="mr-3 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-auditor-text-secondary bg-white dark:bg-auditor-card hover:bg-gray-100 dark:hover:bg-auditor-border border border-gray-300 dark:border-auditor-border rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={!url || isLoading}
                            className="px-4 py-2 text-sm font-semibold text-white bg-auditor-primary hover:bg-blue-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Starting...' : 'Start Audit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewAuditModal;
