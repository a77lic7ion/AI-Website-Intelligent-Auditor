import { GoogleGenAI, Type } from "@google/genai";
import { AiProvider, AuditReport, Issue, ActionItem, Snippet } from "./types";

const auditJsonSchema = {
    type: Type.OBJECT,
    properties: {
        score: {
            type: Type.NUMBER,
            description: "An overall audit score from 0 to 100 for the website based on all categories.",
        },
        issues: {
            type: Type.ARRAY,
            description: "A list of issues found on the website.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "A concise title for the issue." },
                    description: { type: Type.STRING, description: "A detailed explanation of the issue." },
                    severity: { type: Type.STRING, description: "Severity of the issue: Low, Medium, High, or Critical." },
                    category: { type: Type.STRING, description: "Category of the issue: Accessibility, Performance, SEO, Best Practices, or Security." },
                    resolution: { type: Type.STRING, description: "A detailed suggestion on how to fix the issue." },
                },
                required: ["title", "description", "severity", "category", "resolution"],
            },
        },
        actionPlan: {
            type: Type.ARRAY,
            description: "A prioritized list of actions to improve the website's score.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "A concise title for the action item." },
                    description: { type: Type.STRING, description: "A short description of what needs to be done." },
                },
                required: ["title", "description"],
            },
        },
        snippets: {
            type: Type.ARRAY,
            description: "Suggested code snippets to fix identified issues, if applicable.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "A title for the code snippet, relating to the issue it solves." },
                    description: { type: Type.STRING, description: "A brief explanation of what the code does." },
                    code: { type: Type.STRING, description: "The code snippet itself." },
                    language: { type: Type.STRING, description: "The programming language of the snippet (e.g., 'html', 'javascript')." },
                },
                required: ["title", "description", "code", "language"],
            },
        },
    },
    required: ["score", "issues", "actionPlan", "snippets"],
};


// This function simulates fetching HTML. In a real app, this would be a backend call to avoid CORS issues.
async function fetchWebsiteHtml(url: string): Promise<string> {
    console.warn("Simulating HTML fetch for:", url, "In a real app, this should be a backend call to avoid CORS.");
    // Returning a sample HTML for demonstration purposes to ensure audit has content to analyze.
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Old Portfolio</title>
        <style>
            img { max-width: 200px; }
            .alt-missing { border: 2px solid red; }
        </style>
    </head>
    <body>
        <h1>Welcome</h1>
        <p>This is my old portfolio. It has some issues.</p>
        <img src="photo.jpg">
        <a href="/about">About me</a>
        <button onclick="alert('Hello')">Click me!</button>
        <div role="button">I'm a div, not a button</div>
    </body>
    </html>
    `;
}

export async function generateAuditReport(url: string, provider: AiProvider, apiKey: string): Promise<AuditReport> {
    if (provider !== AiProvider.GEMINI) {
        throw new Error(`${provider} is not supported yet.`);
    }

    if (!apiKey) {
        throw new Error("Gemini API key not provided.");
    }
    
    // Per Gemini API guidelines, it's recommended to initialize using an API key from environment variables.
    // This implementation uses a passed-in key to support the multi-provider UI.
    const ai = new GoogleGenAI({ apiKey: apiKey });

    const htmlContent = await fetchWebsiteHtml(url);

    const prompt = `
        Analyze the following HTML content of the website URL "${url}". 
        Perform a comprehensive audit covering Accessibility, Performance, SEO, Best Practices, and Security.
        Based on your analysis, provide a JSON response containing:
        1.  An overall score from 0 to 100.
        2.  A list of identified issues, each with a title, description, severity (Low, Medium, High, or Critical), category, and a detailed resolution.
        3.  A prioritized action plan with a title and description for each action.
        4.  Relevant and specific HTML or JavaScript code snippets to fix critical issues, if any.

        HTML Content:
        \`\`\`html
        ${htmlContent}
        \`\`\`
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro", // Using a powerful model for complex analysis
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: auditJsonSchema,
            },
        });

        // The 'text' property directly contains the model's text output.
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as { score: number; issues: Issue[]; actionPlan: ActionItem[]; snippets: Snippet[] };
        
        return {
            id: new Date().toISOString(),
            url,
            timestamp: Date.now(),
            score: result.score,
            issues: result.issues,
            actionPlan: result.actionPlan,
            snippets: result.snippets,
            provider,
        };
    } catch (error) {
        console.error("Error generating audit report with Gemini:", error);
        throw new Error("Failed to generate audit report. The AI model may have returned an invalid response or an API error occurred.");
    }
}


export async function testApiKey(provider: AiProvider, apiKey: string): Promise<boolean> {
     if (provider !== AiProvider.GEMINI) {
        console.warn(`${provider} key test not implemented.`);
        return false; // For now, only support Gemini
    }

    if (!apiKey) {
        return false;
    }
    
    try {
        // Per Gemini API guidelines, it's recommended to initialize using an API key from environment variables.
        // This implementation tests a user-provided key to match the application's UI functionality.
        const ai = new GoogleGenAI({ apiKey: apiKey });
        
        // Make a simple, low-cost call to verify the key
        await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "test",
        });

        return true;
    } catch (error) {
        console.error(`API key test failed for ${provider}:`, error);
        return false;
    }
}
