import Anthropic from "@anthropic-ai/sdk";
import { AnalysisResult, ResumeContent } from "@/types/resume";
import { AIError } from "@/lib/errors";
import { BaseProvider } from "./base-provider";

export class ClaudeProvider extends BaseProvider {
    readonly name = "Claude 3.5 Sonnet";
    private anthropic: Anthropic;
    private modelName = "claude-3-5-sonnet-20241022";

    constructor(apiKey: string) {
        super();
        if (!apiKey) {
            throw new AIError("Anthropic API key is not set");
        }
        this.anthropic = new Anthropic({ apiKey });
    }

    async analyze(text: string, role: string): Promise<AnalysisResult> {
        try {
            let prompt = await this.getPromptTemplate("analyze-resume.txt");
            prompt = prompt.replace(/{{role}}/g, role).replace("{{text}}", text);

            const message = await this.anthropic.messages.create({
                model: this.modelName,
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
            console.error(`${this.name} Error:`, error);
            throw new AIError(`${this.name} failed: ${error.message}`, error);
        }
    }

    async generate(text: string): Promise<ResumeContent> {
        try {
            let prompt = await this.getPromptTemplate("generate-resume.txt");
            prompt = prompt.replace("{{text}}", text);

            const message = await this.anthropic.messages.create({
                model: this.modelName,
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
            console.error(`${this.name} Error:`, error);
            throw new AIError(`${this.name} failed: ${error.message}`, error);
        }
    }
}
