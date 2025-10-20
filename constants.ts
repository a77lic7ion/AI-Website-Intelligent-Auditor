
import { AuditReport, Issue, IssueSeverity, IssueStatus, PillarCategory } from './types';

export const MOCK_ISSUES: Issue[] = [
  {
    id: '1',
    title: 'Missing Alt Text on Images',
    category: PillarCategory.SEO,
    severity: IssueSeverity.High,
    status: IssueStatus.Open,
    description: '12 images are missing alt text, which impacts accessibility and SEO rankings for image search.',
  },
  {
    id: '2',
    title: 'Slow Loading Speed',
    category: PillarCategory.Performance,
    severity: IssueSeverity.Medium,
    status: IssueStatus.Open,
    description: 'The main page takes over 3.5 seconds to become interactive, potentially leading to a high bounce rate.',
  },
  {
    id: '3',
    title: 'Broken Links',
    category: PillarCategory.SEO,
    severity: IssueSeverity.Low,
    status: IssueStatus.Open,
    description: 'Found 4 broken internal links (404s), which can harm user experience and search engine crawling.',
  },
  {
    id: '4',
    title: 'Unpatched XSS vulnerability',
    category: PillarCategory.Security,
    severity: IssueSeverity.High,
    status: IssueStatus.Open,
    description: 'An outdated library is vulnerable to Cross-Site Scripting attacks.',
  },
  {
    id: '5',
    title: 'Unoptimized Images',
    category: PillarCategory.Performance,
    severity: IssueSeverity.Medium,
    status: IssueStatus.Open,
    description: 'Images are not served in next-gen formats and are larger than necessary.',
  }
];

export const MOCK_AUDIT_REPORT: AuditReport = {
  score: 78,
  scannedPages: 10,
  totalPaes: 'Unlimited',
  issues: MOCK_ISSUES,
};
