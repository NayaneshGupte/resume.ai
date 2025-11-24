"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useResumeStore } from "@/lib/store";
import { ScoreGauge } from "@/components/features/analysis/score-gauge";
import { InsightCard } from "@/components/features/analysis/insight-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
    const router = useRouter();
    const { analysis, reset } = useResumeStore();

    useEffect(() => {
        if (!analysis) {
            router.push("/");
        }
    }, [analysis, router]);

    if (!analysis) return null;

    return (
        <div className="min-h-screen bg-background p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={() => router.push("/")} className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Upload
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => { reset(); router.push("/"); }}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            New Scan
                        </Button>
                        <Button disabled>
                            <Download className="w-4 h-4 mr-2" />
                            Download Report
                        </Button>
                    </div>
                </div>

                {/* Main Score Section */}
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col items-center justify-center p-8 bg-card rounded-xl border shadow-sm"
                    >
                        <ScoreGauge score={analysis.totalScore} size={250} />
                        <div className="mt-6 text-center max-w-md">
                            <h2 className="text-2xl font-bold mb-2">Resume Score</h2>
                            <p className="text-muted-foreground">{analysis.summary}</p>
                        </div>
                    </motion.div>

                    {/* Quick Stats / Highlights could go here */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="grid grid-cols-2 gap-4"
                    >
                        {/* Placeholder for future quick stats */}
                        <div className="p-6 bg-primary/5 rounded-xl border border-primary/10">
                            <h3 className="text-lg font-semibold text-primary">ATS Ready?</h3>
                            <p className="text-3xl font-bold mt-2">
                                {analysis.categories.find(c => c.name.includes("ATS"))?.score || 0}/10
                            </p>
                        </div>
                        <div className="p-6 bg-primary/5 rounded-xl border border-primary/10">
                            <h3 className="text-lg font-semibold text-primary">Skills</h3>
                            <p className="text-3xl font-bold mt-2">
                                {analysis.categories.find(c => c.name.includes("Skills"))?.score || 0}/25
                            </p>
                        </div>
                        <div className="p-6 bg-primary/5 rounded-xl border border-primary/10">
                            <h3 className="text-lg font-semibold text-primary">Impact</h3>
                            <p className="text-3xl font-bold mt-2">
                                {analysis.categories.find(c => c.name.includes("Impact"))?.score || 0}/30
                            </p>
                        </div>
                        <div className="p-6 bg-primary/5 rounded-xl border border-primary/10">
                            <h3 className="text-lg font-semibold text-primary">Experience</h3>
                            <p className="text-3xl font-bold mt-2">
                                {analysis.categories.find(c => c.name.includes("Experience"))?.score || 0}/25
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Detailed Insights */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold">Detailed Analysis</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        {analysis.categories.map((category, index) => (
                            <motion.div
                                key={category.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <InsightCard
                                    category={category.name}
                                    score={category.score}
                                    weight={category.weight}
                                    feedback={category.feedback}
                                    suggestions={category.improvementSuggestions}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
