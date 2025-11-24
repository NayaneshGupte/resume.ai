import OpenAI from "openai";
import { AnalysisResult, ResumeContent } from "@/types/resume";
import { AIError } from "@/lib/errors";
import { BaseProvider } from "./base-provider";

export class OpenAIProvider extends BaseProvider {
    readonly name = "OpenAI GPT-4o Mini";
    private openai: OpenAI;
    private modelName = "gpt-4o-mini";

    constructor(apiKey: string) {
        super();
        if (!apiKey) {
            throw new AIError("OpenAI API key is not set");
        }
        this.openai = new OpenAI({ apiKey });
    }

    async analyze(text: string, role: string): Promise<AnalysisResult> {
        try {
            let prompt = await this.getPromptTemplate("analyze-resume.txt");
            prompt = prompt.replace(/{{role}}/g, role).replace("{{text}}", text);

            const completion = await this.openai.chat.completions.create({
                model: this.modelName,
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
            console.error(`${this.name} Error:`, error);
            throw new AIError(`${this.name} failed: ${error.message}`, error);
        }
    }

    async generate(text: string): Promise<ResumeContent> {
        try {
            let prompt = await this.getPromptTemplate("generate-resume.txt");
            prompt = prompt.replace("{{text}}", text);

            const completion = await this.openai.chat.completions.create({
                model: this.modelName,
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
            console.error(`${this.name} Error:`, error);
            throw new AIError(`${this.name} failed: ${error.message}`, error);
        }
    }
}
