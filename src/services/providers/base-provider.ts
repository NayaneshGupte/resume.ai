import fs from "fs/promises";
import path from "path";
import { AnalysisResult, ResumeContent } from "@/types/resume";
import { AIError } from "@/lib/errors";

export abstract class BaseProvider {
    abstract readonly name: string;

    protected async getPromptTemplate(filename: string): Promise<string> {
        try {
            const filePath = path.join(process.cwd(), "src", "prompts", filename);
            return await fs.readFile(filePath, "utf-8");
        } catch (error) {
            console.error(`Error reading prompt file ${filename}:`, error);
            throw new AIError(`Failed to load prompt template: ${filename}`, error);
        }
    }

    protected cleanJsonOutput(text: string): string {
        return text.replace(/```json\n|\n```/g, "").replace(/```/g, "").trim();
    }

    abstract analyze(text: string, role: string): Promise<AnalysisResult>;
    abstract generate(text: string): Promise<ResumeContent>;
}
