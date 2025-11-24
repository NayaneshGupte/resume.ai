"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
    score: number;
    size?: number;
    strokeWidth?: number;
    className?: string;
}

export function ScoreGauge({
    score,
    size = 200,
    strokeWidth = 15,
    className,
}: ScoreGaugeProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (score / 100) * circumference;

    const getColor = (score: number) => {
        if (score >= 80) return "text-green-500";
        if (score >= 60) return "text-yellow-500";
        return "text-red-500";
    };

    return (
        <div className={cn("relative flex items-center justify-center", className)}>
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background Circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="text-muted/20"
                />
                {/* Progress Circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className={cn("transition-all duration-1000 ease-out", getColor(score))}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
                <motion.span
                    className="text-5xl font-bold"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    {score}
                </motion.span>
                <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider mt-1">
                    Score
                </span>
            </div>
        </div>
    );
}
