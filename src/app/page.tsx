"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/features/upload/file-upload";
import { analyzeResumeAction } from "@/app/actions";
import { useResumeStore } from "@/lib/store";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const { setFile, setText, setAnalysis, setIsAnalyzing } = useResumeStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = async (file: File) => {
    try {
      setIsProcessing(true);
      setIsAnalyzing(true);
      setFile(file);

      toast.info("Parsing resume...");

      // Dynamically import parser to avoid SSR issues
      const { parseResume } = await import("@/lib/parser");
      const text = await parseResume(file);
      setText(text);

      if (!text || text.trim().length < 50) {
        toast.error("Could not extract enough text from the resume. Please try another file.");
        setIsProcessing(false);
        setIsAnalyzing(false);
        return;
      }

      toast.info("Analyzing with Gemini 2.0...");
      const analysis = await analyzeResumeAction(text);
      setAnalysis(analysis);

      toast.success("Analysis complete!");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while analyzing the resume.");
      setIsProcessing(false);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 mb-12 max-w-2xl"
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Resume AI
        </h1>
        <p className="text-xl text-muted-foreground">
          Get a recruiter-grade evaluation of your resume in seconds, powered by Gemini 2.0.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full"
      >
        <FileUpload onFileSelect={handleFileSelect} isUploading={isProcessing} />
      </motion.div>

      <div className="mt-12 text-sm text-muted-foreground">
        <p>Privacy First: Your resume is processed in your browser and never stored.</p>
      </div>
    </div>
  );
}
