import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import fs from "fs/promises";
import path from "path";
import { AnalysisResult, ResumeContent } from "@/types/resume";
import { AIError } from "@/lib/errors";

export class AIService {
    private genAI: GoogleGenerativeAI;
    private anthropic: Anthropic | null = null;
    private openai: OpenAI | null = null;
    private modelName = "gemini-2.0-flash-exp";

    constructor(apiKey: string, anthropicKey?: string, openaiKey?: string) {
        if (!apiKey) {
            throw new AIError("NEXT_PUBLIC_GEMINI_API_KEY is not set");
        }
        this.genAI = new GoogleGenerativeAI(apiKey);

        if (anthropicKey) {
            this.anthropic = new Anthropic({ apiKey: anthropicKey });
        }

        if (openaiKey) {
            this.openai = new OpenAI({ apiKey: openaiKey, dangerouslyAllowBrowser: true });
        }
    }

    private async getPromptTemplate(filename: string): Promise<string> {
        try {
            const filePath = path.join(process.cwd(), "src", "prompts", filename);
            return await fs.readFile(filePath, "utf-8");
        } catch (error) {
            console.error(`Error reading prompt file ${filename}:`, error);
            throw new AIError(`Failed to load prompt template: ${filename}`, error);
        }
    }

    private cleanJsonOutput(text: string): string {
        return text.replace(/```json\n|\n```/g, "").replace(/```/g, "").trim();
    }

    async analyzeResume(text: string, role: string): Promise<AnalysisResult> {
        // Try Gemini 2.0 → OpenAI GPT-4 → Gemini 1.5 → Claude 3.5
        try {
            return await this.tryAnalyzeWithGemini(this.modelName, text, role);
        } catch (error: any) {
            if (error.message?.includes("429") || error.status === 429) {
                console.log("Gemini 2.0 hit rate limit, trying OpenAI GPT-4...");
                if (this.openai) {
                    try {
                        return await this.tryAnalyzeWithOpenAI(text, role);
                    } catch (openaiError: any) {
                        console.log("OpenAI also hit rate limit, trying Gemini 1.5 Flash...");
                    }
                }

                try {
                    return await this.tryAnalyzeWithGemini("gemini-1.5-flash", text, role);
                } catch (fallbackError: any) {
                    if ((fallbackError.message?.includes("429") || fallbackError.status === 429) && this.anthropic) {
                        console.log("Gemini 1.5 also hit rate limit, trying Claude...");
                        try {
                            return await this.tryAnalyzeWithClaude(text, role);
                        } catch (claudeError: any) {
                            console.error("All models failed:", claudeError);
                            throw new AIError("All AI providers are currently unavailable. Please try again later.", claudeError);
                        }
                    }
                    throw new AIError("AI Usage Limit Exceeded. Please wait a minute and try again.", fallbackError);
                }
            }
            throw error;
        }
    }

    private async tryAnalyzeWithGemini(modelName: string, text: string, role: string): Promise<AnalysisResult> {
        const model = this.genAI.getGenerativeModel({ model: modelName });

        try {
            let prompt = await this.getPromptTemplate("analyze-resume.txt");
            prompt = prompt.replace(/{{role}}/g, role).replace("{{text}}", text);

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const jsonString = this.cleanJsonOutput(response.text());

            return JSON.parse(jsonString) as AnalysisResult;
        } catch (error: any) {
            console.error(`Gemini Error (${modelName}):`, error);

            if (error.message?.includes("429") || error.status === 429) {
                throw new AIError("AI Usage Limit Exceeded", error);
            }

            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            throw new AIError(`Failed to analyze resume: ${errorMessage}`, error);
        }
    }

    private async tryAnalyzeWithOpenAI(text: string, role: string): Promise<AnalysisResult> {
        if (!this.openai) {
            throw new AIError("OpenAI API key not configured");
        }

        try {
            let prompt = await this.getPromptTemplate("analyze-resume.txt");
            prompt = prompt.replace(/{{role}}/g, role).replace("{{text}}", text);

            const completion = await this.openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" },
            });

            const content = completion.choices[0]?.message?.content;
            if (!content) {
                throw new Error("No response from OpenAI");
            }

            const jsonString = this.cleanJsonOutput(content);
            return JSON.parse(jsonString) as AnalysisResult;
        } catch (error: any) {
            console.error("OpenAI Error:", error);

            if (error.status === 429) {
                throw new AIError("OpenAI rate limit exceeded", error);
            }

            throw new AIError("Failed to analyze with OpenAI", error);
        }
    }

    private async tryAnalyzeWithClaude(text: string, role: string): Promise<AnalysisResult> {
        if (!this.anthropic) {
            throw new AIError("Anthropic API key not configured");
        }

        try {
            let prompt = await this.getPromptTemplate("analyze-resume.txt");
            prompt = prompt.replace(/{{role}}/g, role).replace("{{text}}", text);

            const message = await this.anthropic.messages.create({
                model: "claude-3-5-sonnet-20241022",
                max_tokens: 4096,
                messages: [{ role: "user", content: prompt }],
            });

            const content = message.content[0];
            if (content.type !== "text") {
                throw new Error("Unexpected response type from Claude");
            }

            const jsonString = this.cleanJsonOutput(content.text);
            return JSON.parse(jsonString) as AnalysisResult;
        } catch (error: any) {
            console.error("Claude Error:", error);
            throw new AIError("Failed to analyze with Claude", error);
        }
    }

    async generateResumeContent(text: string): Promise<ResumeContent> {
        // Try Gemini 2.0 → OpenAI GPT-4 → Gemini 1.5 → Claude 3.5
        try {
            return await this.tryGenerateWithGemini(this.modelName, text);
        } catch (error: any) {
            if (error.message?.includes("429") || error.status === 429) {
                console.log("Gemini 2.0 hit rate limit, trying OpenAI GPT-4...");
                if (this.openai) {
                    try {
                        return await this.tryGenerateWithOpenAI(text);
                    } catch (openaiError: any) {
                        console.log("OpenAI also hit rate limit, trying Gemini 1.5 Flash...");
                    }
                }

                try {
                    return await this.tryGenerateWithGemini("gemini-1.5-flash", text);
                } catch (fallbackError: any) {
                    if ((fallbackError.message?.includes("429") || fallbackError.status === 429) && this.anthropic) {
                        console.log("Gemini 1.5 also hit rate limit, trying Claude...");
                        try {
                            return await this.tryGenerateWithClaude(text);
                        } catch (claudeError: any) {
                            console.error("All models failed:", claudeError);
                            throw new AIError("All AI providers are currently unavailable. Please try again later.", claudeError);
                        }
                    }
                    throw new AIError("AI Usage Limit Exceeded. Please wait a minute and try again.", fallbackError);
                }
            }
            throw error;
        }
    }

    private async tryGenerateWithGemini(modelName: string, text: string): Promise<ResumeContent> {
        const model = this.genAI.getGenerativeModel({ model: modelName });

        try {
            let prompt = await this.getPromptTemplate("generate-resume.txt");
            prompt = prompt.replace("{{text}}", text);

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const jsonString = this.cleanJsonOutput(response.text());

            return JSON.parse(jsonString) as ResumeContent;
        } catch (error: any) {
            console.error(`Gemini Error (${modelName}):`, error);

            if (error.message?.includes("429") || error.status === 429) {
                throw new AIError("AI Usage Limit Exceeded", error);
            }

            throw new AIError("Failed to generate resume content", error);
        }
    }

    private async tryGenerateWithOpenAI(text: string): Promise<ResumeContent> {
        if (!this.openai) {
            throw new AIError("OpenAI API key not configured");
        }

        try {
            let prompt = await this.getPromptTemplate("generate-resume.txt");
            prompt = prompt.replace("{{text}}", text);

            const completion = await this.openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" },
            });

            const content = completion.choices[0]?.message?.content;
            if (!content) {
                throw new Error("No response from OpenAI");
            }

            const jsonString = this.cleanJsonOutput(content);
            return JSON.parse(jsonString) as ResumeContent;
        } catch (error: any) {
            console.error("OpenAI Error:", error);

            if (error.status === 429) {
                throw new AIError("OpenAI rate limit exceeded", error);
            }

            throw new AIError("Failed to generate with OpenAI", error);
        }
    }

    private async tryGenerateWithClaude(text: string): Promise<ResumeContent> {
        if (!this.anthropic) {
            throw new AIError("Anthropic API key not configured");
        }

        try {
            let prompt = await this.getPromptTemplate("generate-resume.txt");
            prompt = prompt.replace("{{text}}", text);

            const message = await this.anthropic.messages.create({
                model: "claude-3-5-sonnet-20241022",
                max_tokens: 4096,
                messages: [{ role: "user", content: prompt }],
            });

            const content = message.content[0];
            if (content.type !== "text") {
                throw new Error("Unexpected response type from Claude");
            }

            const jsonString = this.cleanJsonOutput(content.text);
            return JSON.parse(jsonString) as ResumeContent;
        } catch (error: any) {
            console.error("Claude Error:", error);
            throw new AIError("Failed to generate with Claude", error);
        }
    }
}

export const aiService = new AIService(
    process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
    process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
    process.env.NEXT_PUBLIC_OPENAI_API_KEY
);
