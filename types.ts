// types.ts

export type Page = 'Dashboard' | 'Reports' | 'Integrations' | 'Settings';

export type Theme = 'light' | 'dark' | 'system';

export enum AiProvider {
    GEMINI = 'Gemini',
    OPENAI = 'OpenAI',
    MISTRAL = 'Mistral',
    OLLAMA = 'Ollama',
}

export interface User {
    email: string;
    fullName: string;
    isPro: boolean;
}

export enum PillarCategory {
    PERFORMANCE = 'Performance',
    ACCESSIBILITY = 'Accessibility',
    SEO = 'SEO',
    BEST_PRACTICES = 'Best Practices',
    SECURITY = 'Security',
}

export enum IssueSeverity {
    HIGH = 'High',
    MEDIUM = 'Medium',
    LOW = 'Low',
}

export enum IssueStatus {
    OPEN = 'Open',
    IN_PROGRESS = 'In Progress',
    RESOLVED = 'Resolved',
}

export interface Issue {
    id: string;
    title: string;
    description: string;
    severity: IssueSeverity;
    category: PillarCategory;
    status: IssueStatus;
    contextualSnippet?: string;
    screenshotPlaceholderUrl?: string;
}

export interface AuditReport {
    score: number;
    scannedPages: number;
    issues: Issue[];
}

export interface AiAnalysis {
    summary: string;
    prioritizedActionPlan: {
        title: string;
        description: string;
    }[];
    suggestedSnippets: {
        title: string;
        description: string;
        code: string;
        language: string;
    }[];
}

export interface AiGeneratedAudit {
    auditReport: AuditReport;
    aiAnalysis: AiAnalysis;
}