import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalysisResult, ResumeContent } from "@/types/resume";
import { AIError } from "@/lib/errors";
import { BaseProvider } from "./base-provider";

export class GeminiProvider extends BaseProvider {
    readonly name = "Gemini 2.0 Flash Exp";
    private genAI: GoogleGenerativeAI;
    private modelName = "gemini-2.0-flash-exp";

    constructor(apiKey: string) {
        super();
        if (!apiKey) {
            throw new AIError("Gemini API key is not set");
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    async analyze(text: string, role: string): Promise<AnalysisResult> {
        const model = this.genAI.getGenerativeModel({ model: this.modelName });

        try {
            let prompt = await this.getPromptTemplate("analyze-resume.txt");
            prompt = prompt.replace(/{{role}}/g, role).replace("{{text}}", text);

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const jsonString = this.cleanJsonOutput(response.text());

            return JSON.parse(jsonString) as AnalysisResult;
        } catch (error: any) {
            console.error(`${this.name} Error:`, error);
            throw new AIError(`${this.name} failed: ${error.message}`, error);
        }
    }

    async generate(text: string): Promise<ResumeContent> {
        const model = this.genAI.getGenerativeModel({ model: this.modelName });

        try {
            let prompt = await this.getPromptTemplate("generate-resume.txt");
            prompt = prompt.replace("{{text}}", text);

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const jsonString = this.cleanJsonOutput(response.text());

            return JSON.parse(jsonString) as ResumeContent;
        } catch (error: any) {
            console.error(`${this.name} Error:`, error);
            throw new AIError(`${this.name} failed: ${error.message}`, error);
        }
    }
}
