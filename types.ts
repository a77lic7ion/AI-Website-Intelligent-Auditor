export type Page = 'Dashboard' | 'Reports' | 'Integrations' | 'Settings';

export interface User {
  email: string;
  fullName: string;
}

export type Theme = 'light' | 'dark' | 'system';

export enum AiProvider {
  GEMINI = 'Gemini',
  OPENAI = 'OpenAI',
  MISTRAL = 'Mistral',
  OLLAMA = 'Ollama',
}

export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';

export type IssueCategory = 'Accessibility' | 'Performance' | 'SEO' | 'Best Practices' | 'Security';

export interface Issue {
  title: string;
  description: string;
  severity: Severity;
  category: IssueCategory;
  resolution: string;
}

export interface Snippet {
    title: string;
    description: string;
    code: string;
    language: string;
}

export interface ActionItem {
    title: string;
    description: string;
}

export interface AuditReport {
  id: string;
  url: string;
  timestamp: number;
  score: number;
  provider: AiProvider;
  issues: Issue[];
  actionPlan: ActionItem[];
  snippets: Snippet[];
}
