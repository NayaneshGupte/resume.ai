import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs/promises";
import path from "path";
import { AnalysisResult, ResumeContent } from "@/types/resume";
import { AIError } from "@/lib/errors";

export class AIService {
    private genAI: GoogleGenerativeAI;
    private modelName = "gemini-2.0-flash-exp";

    constructor(apiKey: string) {
        if (!apiKey) {
            throw new AIError("NEXT_PUBLIC_GEMINI_API_KEY is not set");
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
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
        const model = this.genAI.getGenerativeModel({ model: this.modelName });

        try {
            let prompt = await this.getPromptTemplate("analyze-resume.txt");
            prompt = prompt.replace(/{{role}}/g, role).replace("{{text}}", text);

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const jsonString = this.cleanJsonOutput(response.text());

            return JSON.parse(jsonString) as AnalysisResult;
        } catch (error: any) {
            console.error("AIService Error (analyzeResume):", error);

            if (error.message?.includes("429") || error.status === 429) {
                throw new AIError("AI Usage Limit Exceeded. Please wait a minute and try again.", error);
            }

            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            throw new AIError(`Failed to analyze resume: ${errorMessage}`, error);
        }
    }

    async generateResumeContent(text: string): Promise<ResumeContent> {
        const model = this.genAI.getGenerativeModel({ model: this.modelName });

        try {
            let prompt = await this.getPromptTemplate("generate-resume.txt");
            prompt = prompt.replace("{{text}}", text);

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const jsonString = this.cleanJsonOutput(response.text());

            return JSON.parse(jsonString) as ResumeContent;
        } catch (error: any) {
            console.error("AIService Error (generateResumeContent):", error);

            if (error.message?.includes("429") || error.status === 429) {
                throw new AIError("AI Usage Limit Exceeded. Please wait a minute and try again.", error);
            }

            throw new AIError("Failed to generate resume content", error);
        }
    }
}

export const aiService = new AIService(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
