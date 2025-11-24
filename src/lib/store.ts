import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AnalysisResult } from '@/types/resume';

interface ResumeState {
    file: File | null;
    text: string | null;
    analysis: AnalysisResult | null;
    isAnalyzing: boolean;
    setFile: (file: File) => void;
    setText: (text: string) => void;
    setAnalysis: (analysis: AnalysisResult) => void;
    setIsAnalyzing: (isAnalyzing: boolean) => void;
    reset: () => void;
}

export const useResumeStore = create<ResumeState>()(
    persist(
        (set) => ({
            file: null,
            text: null,
            analysis: null,
            isAnalyzing: false,
            setFile: (file) => set({ file }),
            setText: (text) => set({ text }),
            setAnalysis: (analysis) => set({ analysis }),
            setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
            reset: () => set({ file: null, text: null, analysis: null, isAnalyzing: false }),
        }),
        {
            name: 'resume-storage',
            partialize: (state) => ({
                text: state.text,
                analysis: state.analysis
            }), // Don't persist File object as it's not serializable
        }
    )
);
