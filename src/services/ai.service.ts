import { AnalysisResult, ResumeContent } from "@/types/resume";
import { AIError } from "@/lib/errors";
import { GeminiProvider } from "./providers/gemini-provider";
import { OpenAIProvider } from "./providers/openai-provider";
import { ClaudeProvider } from "./providers/claude-provider";
import { BaseProvider } from "./providers/base-provider";

export class AIService {
    private providers: BaseProvider[] = [];

    constructor(
        geminiKey: string,
        openaiKey?: string,
        anthropicKey?: string
    ) {
        // Initialize providers in fallback order: Gemini → OpenAI → Claude
        if (geminiKey) {
            this.providers.push(new GeminiProvider(geminiKey));
        }

        if (openaiKey) {
            this.providers.push(new OpenAIProvider(openaiKey));
        }

        if (anthropicKey) {
            this.providers.push(new ClaudeProvider(anthropicKey));
        }

        if (this.providers.length === 0) {
            throw new AIError("No AI providers configured. Please set at least one API key.");
        }
    }

    async analyzeResume(text: string, role: string): Promise<AnalysisResult> {
        const errors: string[] = [];

        for (const provider of this.providers) {
            try {
                console.log(`Trying ${provider.name}...`);
                return await provider.analyze(text, role);
            } catch (error: any) {
                errors.push(`${provider.name}: ${error.message}`);
                console.log(`${provider.name} failed, trying next provider...`);
            }
        }

        // All providers failed
        throw new AIError(`All AI providers failed:\n${errors.join('\n')}`);
    }

    async generateResumeContent(text: string): Promise<ResumeContent> {
        const errors: string[] = [];

        for (const provider of this.providers) {
            try {
                console.log(`Trying ${provider.name}...`);
                return await provider.generate(text);
            } catch (error: any) {
                errors.push(`${provider.name}: ${error.message}`);
                console.log(`${provider.name} failed, trying next provider...`);
            }
        }

        // All providers failed
        throw new AIError(`All AI providers failed:\n${errors.join('\n')}`);
    }
}

export const aiService = new AIService(
    process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
    process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY
);
