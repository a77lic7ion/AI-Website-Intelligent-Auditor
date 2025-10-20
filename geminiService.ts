import { AiGeneratedAudit } from './types';
import { GoogleGenAI, Type } from "@google/genai";

const issueSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "A unique identifier for the issue, e.g., 'seo-1'." },
        title: { type: Type.STRING, description: "A short, descriptive title for the issue." },
        category: {
            type: Type.STRING,
            enum: ['Performance', 'SEO', 'Accessibility', 'Security', 'UI/UX & Best Practices'],
            description: "The category the issue belongs to."
        },
        severity: {
            type: Type.STRING,
            enum: ['High', 'Medium', 'Low'],
            description: "The severity level of the issue."
        },
        status: {
            type: Type.STRING,
            enum: ['Open', 'Fixed', 'Investigating'],
            description: "The current status of the issue."
        },
        description: { type: Type.STRING, description: "A detailed explanation of the issue, what it is, and why it matters." },
    },
    required: ['id', 'title', 'category', 'severity', 'status', 'description']
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        auditReport: {
            type: Type.OBJECT,
            properties: {
                score: { type: Type.INTEGER, description: "An overall health score for the website from 0 to 100, based on the findings." },
                scannedPages: { type: Type.INTEGER, description: "The number of pages hypothetically scanned. Assume between 50 and 250." },
                totalPaes: { type: Type.STRING, description: "Always set this to 'Unlimited'." },
                issues: {
                    type: Type.ARRAY,
                    items: issueSchema,
                    description: "A list of all issues found during the audit. Generate at least 10-15 diverse issues across all categories."
                },
            },
            required: ['score', 'scannedPages', 'totalPaes', 'issues']
        },
        aiAnalysis: {
            type: Type.OBJECT,
            properties: {
                summary: { type: Type.STRING, description: "A 2-3 sentence executive summary of the most critical findings from the audit." },
                prioritizedActionPlan: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING, description: "A short title for the action item." },
                            description: { type: Type.STRING, description: "A detailed description of the action to be taken." },
                        },
                        required: ['title', 'description']
                    },
                    description: "A list of the top 3 most important actions to take."
                },
                suggestedSnippets: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING, description: "A title for the code snippet." },
                            description: { type: Type.STRING, description: "A description of what the code snippet does." },
                            code: { type: Type.STRING, description: "The actual code snippet." },
                            language: { type: Type.STRING, description: "The programming language of the snippet (e.g., 'html', 'javascript')." },
                        },
                        required: ['title', 'description', 'code', 'language']
                    },
                    description: "A list of 1-2 relevant code snippets to fix a specific, high-priority issue."
                },
            },
            required: ['summary', 'prioritizedActionPlan', 'suggestedSnippets']
        }
    },
    required: ['auditReport', 'aiAnalysis']
};

export const generateAudit = async (url: string): Promise<AiGeneratedAudit> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
        As a world-class senior frontend engineer and SEO specialist, perform a comprehensive audit of the website at the URL: ${url}.

        Analyze its performance, SEO, accessibility, security, and UI/UX best practices.
        
        Your response MUST be a single JSON object that strictly adheres to the provided schema. Do not include any markdown formatting or introductory text outside of the JSON object.
        
        Generate a diverse list of at least 10-15 realistic issues you would expect to find on a standard business or e-commerce website. Be specific and provide actionable descriptions.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);

        // Basic validation to ensure the response structure is correct
        if (!parsedResponse.auditReport || !parsedResponse.aiAnalysis) {
            throw new Error("Invalid JSON structure received from API.");
        }
        
        return parsedResponse as AiGeneratedAudit;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate audit from Gemini API.");
    }
};