import { GoogleGenAI, Type } from "@google/genai";
import { AiGeneratedAudit, IssueSeverity, PillarCategory, AiProvider } from "./types";

const auditSchema = {
  type: Type.OBJECT,
  properties: {
    auditReport: {
      type: Type.OBJECT,
      properties: {
        score: {
          type: Type.NUMBER,
          description: "Overall score from 0-100, where 100 is excellent."
        },
        scannedPages: {
          type: Type.NUMBER,
          description: "The number of pages scanned on the website."
        },
        issues: {
          type: Type.ARRAY,
          description: "A list of issues found on the site.",
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "A unique identifier for the issue (e.g., 'seo-meta-description')." },
              title: { type: Type.STRING, description: "A short, descriptive title for the issue." },
              description: { type: Type.STRING, description: "A longer explanation of the issue, its impact, and how to fix it." },
              severity: {
                type: Type.STRING,
                enum: Object.values(IssueSeverity),
                description: "The severity of the issue."
              },
              category: {
                type: Type.STRING,
                enum: Object.values(PillarCategory),
                description: "The category this issue falls under."
              },
              status: {
                type: Type.STRING,
                enum: ["Open"],
                description: "The initial status of the issue, which should always be 'Open'."
              },
              contextualSnippet: { 
                type: Type.STRING, 
                description: "A small, relevant snippet of HTML/code from the page that shows the issue. Use 'N/A' if not applicable." 
              },
              screenshotPlaceholderUrl: { 
                type: Type.STRING, 
                description: "For visual issues (UI/UX, layout), provide a placeholder image URL from 'https://placehold.co/' that represents the issue (e.g., 'https://placehold.co/600x400/EEE/31343C?text=Missing+Alt+Text'). Use 'N/A' if not applicable." 
              },
            },
            required: ["id", "title", "description", "severity", "category", "status", "contextualSnippet", "screenshotPlaceholderUrl"]
          }
        },
      },
      required: ["score", "scannedPages", "issues"]
    },
    aiAnalysis: {
      type: Type.OBJECT,
      properties: {
        summary: {
          type: Type.STRING,
          description: "A 2-3 sentence summary of the audit findings, highlighting the most critical areas for improvement."
        },
        prioritizedActionPlan: {
          type: Type.ARRAY,
          description: "A list of 3-5 high-priority actions the user should take to fix the most critical issues.",
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "A short title for the action item." },
              description: { type: Type.STRING, description: "A brief explanation of what to do." }
            },
            required: ["title", "description"]
          }
        },
        suggestedSnippets: {
          type: Type.ARRAY,
          description: "A list of 1-2 helpful code snippets to fix a specific, common issue found (e.g., meta tags, alt text). Can be an empty array if no simple snippets apply.",
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "The title of the code snippet suggestion." },
              description: { type: Type.STRING, description: "A brief explanation of what the code does." },
              code: { type: Type.STRING, description: "The actual code snippet." },
              language: { type: Type.STRING, description: "The programming language of the snippet (e.g., html, css, javascript)." }
            },
            required: ["title", "description", "code", "language"]
          }
        },
      },
      required: ["summary", "prioritizedActionPlan", "suggestedSnippets"]
    }
  },
  required: ["auditReport", "aiAnalysis"]
};

const getBasePrompt = (url: string, pageHtml: string): string => `
  You are a world-class website auditor and SEO expert. Analyze the HTML content of the website at ${url}.
  The goal is to perform a comprehensive audit covering Performance, Accessibility, SEO, Best Practices, and Security.
  
  Based on your analysis of the following HTML, generate a detailed audit report.
  
  HTML Content (first 30,000 characters):
  \`\`\`html
  ${pageHtml.substring(0, 30000)} 
  \`\`\`

  Your response must be a JSON object that strictly adheres to the provided schema.
  - The score should be calculated based on the number and severity of issues. A high number of critical issues should result in a lower score.
  - Generate a realistic number of scanned pages (e.g., between 5 and 50).
  - Identify between 5 to 15 issues across different categories. For each issue, provide a contextual code snippet and a placeholder screenshot URL where applicable.
  - Provide a concise summary and a clear, prioritized action plan.
  - Suggest 1-2 relevant code snippets if applicable.
  - Each issue must have a unique ID.
`;

const runGeminiAudit = async (apiKey: string, url: string, pageHtml: string): Promise<AiGeneratedAudit> => {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: getBasePrompt(url, pageHtml),
      config: {
        responseMimeType: "application/json",
        responseSchema: auditSchema,
      },
    });
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as AiGeneratedAudit;
};

const runOpenAiAudit = async (apiKey: string, url: string, pageHtml: string): Promise<AiGeneratedAudit> => {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-4-turbo",
            messages: [{ role: "user", content: getBasePrompt(url, pageHtml) }],
            response_format: { type: "json_object" },
        }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API Error: ${error.error.message}`);
    }
    const result = await response.json();
    return JSON.parse(result.choices[0].message.content) as AiGeneratedAudit;
};

// Simplified wrappers for Mistral and Ollama, assuming they can follow the JSON instruction
const runGenericApiAudit = async (apiUrl: string, apiKey: string, model: string, url: string, pageHtml: string): Promise<AiGeneratedAudit> => {
     const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model,
            messages: [{ role: "user", content: `${getBasePrompt(url, pageHtml)} \n\nIMPORTANT: Your response MUST be a single JSON object matching the schema. Do not wrap it in markdown.` }],
            response_format: { type: "json_object" }, // For compatible endpoints
        }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(`API Error at ${apiUrl}: ${error.error?.message || response.statusText}`);
    }
    const result = await response.json();
    const content = result.choices[0].message.content;
    // Clean potential markdown fences
    const cleanedContent = content.replace(/^```json\s*|```\s*$/g, '');
    return JSON.parse(cleanedContent) as AiGeneratedAudit;
}


export const runAudit = async (provider: AiProvider, apiKey: string, url: string, pageHtml: string): Promise<AiGeneratedAudit> => {
  try {
    switch (provider) {
        case AiProvider.GEMINI:
            return await runGeminiAudit(apiKey, url, pageHtml);
        case AiProvider.OPENAI:
            return await runOpenAiAudit(apiKey, url, pageHtml);
        case AiProvider.MISTRAL:
            return await runGenericApiAudit("https://api.mistral.ai/v1/chat/completions", apiKey, "mistral-large-latest", url, pageHtml);
        case AiProvider.OLLAMA:
             // For Ollama, apiKey is the full URL (e.g., http://localhost:11434) and we don't use bearer token
            return await runGenericApiAudit(`${apiKey}/api/chat`, "ollama-key", "llama3", url, pageHtml);
        default:
            throw new Error("Unsupported AI provider");
    }
  } catch (error) {
    console.error(`Error running ${provider} audit:`, error);
    if (error instanceof Error && error.message.includes('SAFETY')) {
      throw new Error("The request was blocked due to safety settings. Please try a different URL.");
    }
    throw new Error(`Failed to generate the audit with ${provider}. ${error instanceof Error ? error.message : 'Please check the console for details.'}`);
  }
};

export const testApiKey = async (provider: AiProvider, apiKey: string): Promise<boolean> => {
    try {
        if (provider === AiProvider.GEMINI) {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
            return response.ok;
        }
        if (provider === AiProvider.OPENAI) {
            const response = await fetch("https://api.openai.com/v1/models", { headers: { "Authorization": `Bearer ${apiKey}` } });
            return response.ok;
        }
        if (provider === AiProvider.MISTRAL) {
             const response = await fetch("https://api.mistral.ai/v1/models", { headers: { "Authorization": `Bearer ${apiKey}` } });
            return response.ok;
        }
         if (provider === AiProvider.OLLAMA) {
             const response = await fetch(apiKey); // Test base URL for Ollama
            return response.ok;
        }
        return false;
    } catch (e) {
        return false;
    }
};