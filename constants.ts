
import { AuditReport, User, AiProvider } from './types';

export const MOCK_USER: User = {
    fullName: 'Pro User',
    email: 'pro.user@example.com',
};

export const MOCK_AUDIT_REPORT: AuditReport = {
    id: '1',
    url: 'https://example.com',
    score: 85,
    timestamp: Date.now(),
    provider: AiProvider.GEMINI,
    reportData: {
        score: 85,
        issues: [
            { id: '1', severity: 'High', title: 'Missing H1 Tag', description: 'The page is missing a H1 tag, which is crucial for SEO and accessibility.', recommendation: 'Add a descriptive H1 tag to the main content of the page.' },
            { id: '2', severity: 'Medium', title: 'Images without alt text', description: 'Some images are missing "alt" attributes, making them inaccessible to screen readers.', recommendation: 'Add descriptive alt text to all images to improve accessibility.' },
            { id: '3', severity: 'Low', title: 'Inefficient CSS selectors', description: 'Some CSS selectors are overly complex, which can slow down page rendering.', recommendation: 'Simplify CSS selectors where possible to improve performance.' },
        ],
        actionPlan: [
            { title: 'Add a H1 Tag', description: 'Implement a single, unique H1 tag on the page to define the main topic.' },
            { title: 'Add Alt Text to Images', description: 'Review all images and add meaningful alt text for screen reader users.' },
        ],
        snippets: [
            {
                title: 'Example Accessible Image',
                description: 'This snippet shows how to add an alt attribute to an image tag.',
                code: '<img src="example.jpg" alt="A descriptive summary of the image content." />',
                language: 'html'
            }
        ]
    }
};
