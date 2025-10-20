// FIX: Removed self-import causing declaration conflicts. The file was importing types from itself.
export enum IssueSeverity {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export enum IssueStatus {
  Open = 'Open',
  Fixed = 'Fixed',
  Investigating = 'Investigating',
}

export enum PillarCategory {
    Performance = 'Performance',
    SEO = 'SEO',
    Accessibility = 'Accessibility',
    Security = 'Security',
    UIUX = 'UI/UX & Best Practices',
}

export interface Issue {
  id: string;
  title: string;
  category: PillarCategory;
  severity: IssueSeverity;
  status: IssueStatus;
  description: string;
}

export interface AuditReport {
  score: number;
  scannedPages: number;
  totalPaes: 'Unlimited' | number;
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


export interface User {
    fullName: string;
    email: string;
    isPro: boolean;
}

export type Page = 'Dashboard' | 'Reports' | 'Integrations' | 'Settings';
export type Theme = 'light' | 'dark' | 'system';