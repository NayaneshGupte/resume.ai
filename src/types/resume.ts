export interface ScoreCategory {
    name: string;
    score: number;
    weight: number;
    feedback: string[];
    improvementSuggestions: string[];
}

export interface AnalysisResult {
    totalScore: number;
    summary: string;
    categories: ScoreCategory[];
}

export interface ResumeContent {
    fullName: string;
    contact: {
        email: string;
        phone: string;
        linkedin?: string;
        location?: string;
    };
    summary: string;
    skills: string[];
    experience: {
        company: string;
        position: string;
        startDate: string;
        endDate: string;
        highlights: string[];
    }[];
    education: {
        institution: string;
        degree: string;
        year: string;
    }[];
    projects: {
        name: string;
        description: string;
        technologies: string[];
    }[];
}
