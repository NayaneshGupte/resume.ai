"use server";

import { aiService } from "@/services/ai.service";

export async function analyzeResumeAction(text: string, role: string = "General Software Engineering Role") {
    return await aiService.analyzeResume(text, role);
}

export async function generateResumeContentAction(text: string) {
    return await aiService.generateResumeContent(text);
}
