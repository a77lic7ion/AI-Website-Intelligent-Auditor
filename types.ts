
export type Page = 'Dashboard' | 'Reports' | 'Integrations' | 'Settings';

export type Theme = 'light' | 'dark' | 'system';

export interface User {
  fullName: string;
  email: string;
}

export enum AiProvider {
  GEMINI = 'Gemini',
  OPENAI = 'OpenAI',
  MISTRAL = 'Mistral',
  OLLAMA = 'Ollama',
}

export interface AuditReport {
  id: string;
  url: string;
  score: number;
  timestamp: number;
  provider: AiProvider;
  reportData: AuditReportData;
}

export interface AuditReportData {
    score: number;
    issues: Issue[];
    actionPlan: ActionItem[];
    snippets: Snippet[];
}

export interface Issue {
    id: string;
    severity: 'Low' | 'Medium' | 'High';
    title: string;
    description: string;
    recommendation: string;
    isExpanded?: boolean;
}

export interface ActionItem {
    title: string;
    description: string;
}

export interface Snippet {
    title: string;
    description: string;
    code: string;
    language: string;
}
