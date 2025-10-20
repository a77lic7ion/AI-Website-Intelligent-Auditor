
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { AiProvider, AuditReportData } from './types';

// FIX: This function is updated to align with API key guidelines.
// For Gemini, it tests the centrally configured key from process.env.API_KEY.
// For other providers, it uses the key from the UI for testing purposes.
export const testApiKey = async (provider: AiProvider, apiKey?: string): Promise<boolean> => {
    if (provider === AiProvider.GEMINI) {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: 'test',
            });
            return !!response.text;
        } catch (error) {
            console.error("Gemini API key test failed:", error);
            return false;
        }
    }

    if (!apiKey) return false;
    // Mock for other providers
    return new Promise(resolve => setTimeout(() => resolve(true), 500));
};

const PROMPT = `
Analyze the provided website source code and generate a comprehensive SEO, performance, and accessibility audit report.

The output must be a JSON object that strictly follows this schema:
{
  "score": <A number from 0-100 representing the overall score>,
  "issues": [
    {
      "id": "<unique string id>",
      "severity": "<'Low' | 'Medium' | 'High'>",
      "title": "<A concise title for the issue>",
      "description": "<A detailed but easy-to-understand description of the issue>",
      "recommendation": "<A clear, actionable recommendation to fix the issue>"
    }
  ],
  "actionPlan": [
    {
      "title": "<A short, actionable task title>",
      "description": "<A brief description of what needs to be done for this action item>"
    }
  ],
  "snippets": [
    {
      "title": "<A title for the code snippet>",
      "description": "<A description of what the snippet does or fixes>",
      "code": "<The actual code snippet>",
      "language": "<The programming language, e.g., 'html', 'css', 'javascript'>"
    }
  ]
}

Prioritize the most critical issues. The action plan should list the top 2-3 most impactful changes. Provide code snippets for the most important fixes if applicable.
Do not include any text, markdown, or JSON object markers before or after the JSON object.
`;

// FIX: This function is updated to align with API key guidelines.
// The apiKey parameter is removed for Gemini, and process.env.API_KEY is used directly.
export const runAudit = async (url: string, provider: AiProvider): Promise<AuditReportData> => {
    if (provider !== AiProvider.GEMINI) {
        // Mocking for other providers
        console.warn(`Audit for ${provider} is not implemented. Returning mock data.`);
        return new Promise(resolve => setTimeout(() => resolve({
            score: 78,
            issues: [
                { id: 'mock-1', severity: 'High', title: 'Mock Issue 1', description: 'This is a mock issue.', recommendation: 'This is a mock recommendation.' },
                { id: 'mock-2', severity: 'Medium', title: 'Mock Issue 2', description: 'This is a mock issue.', recommendation: 'This is a mock recommendation.' },
            ],
            actionPlan: [{ title: 'Mock Action', description: 'Do the mock thing.' }],
            snippets: [{ title: 'Mock Snippet', description: 'A mock code snippet.', code: '<div>Mock</div>', language: 'html' }]
        }), 2000));
    }
    
    // In a real app, you would fetch the website's HTML source here.
    // For this example, we'll use a placeholder HTML structure.
    const websiteHtmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>My Test Website</title>
            <meta name="description" content="A test website for auditing.">
            <link rel="stylesheet" href="style.css">
        </head>
        <body>
            <header>
                <nav>
                    <ul>
                        <li><a>Home</a></li>
                        <li><a href="/about">About</a></li>
                    </ul>
                </nav>
            </header>
            <main>
                <p>Welcome to my website.</p>
                <img src="photo.jpg">
            </main>
        </body>
        </html>
    `;

    try {
        // FIX: Initialize with API_KEY from environment variables as per guidelines.
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const response: GenerateContentResponse = await ai.models.generateContent({
            // FIX: Using gemini-2.5-pro for a complex reasoning task.
            model: "gemini-2.5-pro",
            contents: `Analyze the following HTML for ${url} and generate an audit report.\n\n\`\`\`html\n${websiteHtmlContent}\n\`\`\``,
            config: {
                // FIX: Requesting JSON output with a specific schema.
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.NUMBER },
                        issues: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    severity: { type: Type.STRING },
                                    title: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    recommendation: { type: Type.STRING },
                                },
                                required: ["id", "severity", "title", "description", "recommendation"],
                            },
                        },
                        actionPlan: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                },
                                required: ["title", "description"],
                            },
                        },
                        snippets: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    code: { type: Type.STRING },
                                    language: { type: Type.STRING },
                                },
                                required: ["title", "description", "code", "language"],
                            },
                        },
                    },
                    required: ["score", "issues", "actionPlan", "snippets"],
                },
                systemInstruction: PROMPT,
            },
        });
        
        // FIX: Extract text directly from response object.
        const jsonText = response.text;
        const parsedData = JSON.parse(jsonText) as AuditReportData;
        
        parsedData.issues = parsedData.issues.map((issue, index) => ({...issue, id: issue.id || `issue-${index}`}));

        return parsedData;

    } catch (error) {
        console.error("Error running audit with Gemini:", error);
        throw new Error("Failed to generate audit report from AI provider.");
    }
};
