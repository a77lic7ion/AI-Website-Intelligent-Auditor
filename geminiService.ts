import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { AiProvider, AuditReportData } from './types';

export const testApiKey = async (provider: AiProvider, apiKey: string): Promise<void> => {
    if (!apiKey && provider !== AiProvider.OLLAMA) {
        throw new Error("API Key is required.");
    }

    if (provider === AiProvider.GEMINI) {
        try {
            const ai = new GoogleGenAI({ apiKey });
            await ai.models.generateContent({
                model: 'gemini-2.5-flash', // Corrected model name
                contents: 'test',
            });
            // Success is implied by not throwing an error
        } catch (error) {
            console.error("Gemini API key test failed:", error);
            if (error instanceof Error && (error.message.includes('API key') || error.message.includes('invalid'))) {
                throw new Error("The provided Gemini API Key appears to be invalid.");
            }
            throw new Error("Connection failed. The API might be unavailable or there could be a network issue.");
        }
    } else {
        // Mock for other providers with simple validation
        return new Promise((resolve, reject) => 
            setTimeout(() => {
                if (apiKey.length > 5) {
                    resolve();
                } else {
                    reject(new Error(`The ${provider} API Key seems too short.`));
                }
            }, 500)
        );
    }
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

export const runAudit = async (url: string, provider: AiProvider, apiKey: string): Promise<AuditReportData> => {
    if (provider !== AiProvider.GEMINI) {
        console.warn(`Audit for ${provider} is not implemented. Returning mock data.`);
        return Promise.reject(new Error(`${provider} audits are not yet implemented.`));
    }
    
    // Use a CORS proxy to fetch the website's HTML source
    const proxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;
    let websiteHtmlContent = '';
    try {
        const response = await fetch(proxyUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${response.statusText}`);
        }
        websiteHtmlContent = await response.text();
    } catch (error) {
        console.error("Error fetching website content:", error);
        throw new Error("Could not retrieve the website's content. The URL may be invalid or the site may be blocking requests.");
    }
    
    try {
        const ai = new GoogleGenAI({ apiKey });

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: `Analyze the following HTML for ${url} and generate an audit report.\n\n\`\`\`html\n${websiteHtmlContent}\n\`\`\``,
            config: {
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
        
        const jsonText = response.text;
        const parsedData = JSON.parse(jsonText) as AuditReportData;
        
        parsedData.issues = parsedData.issues.map((issue, index) => ({...issue, id: issue.id || `issue-${index}`}));

        return parsedData;

    } catch (error) {
        console.error("Error running audit with Gemini:", error);
        if (error instanceof Error && error.message.includes('API key')) {
             throw new Error("The provided Gemini API Key is invalid or has expired.");
        }
        throw new Error("Failed to generate audit report from AI provider.");
    }
};