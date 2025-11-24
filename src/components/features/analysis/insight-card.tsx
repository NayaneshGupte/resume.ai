"use client";

import { CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface InsightCardProps {
    category: string;
    score: number;
    weight: number;
    feedback: string[];
    suggestions: string[];
}

export function InsightCard({
    category,
    score,
    weight,
    feedback,
    suggestions,
}: InsightCardProps) {
    // Calculate percentage relative to weight
    const percentage = (score / weight) * 100;

    const getStatusColor = (percent: number) => {
        if (percent >= 80) return "bg-green-500";
        if (percent >= 60) return "bg-yellow-500";
        return "bg-red-500";
    };

    const getStatusText = (percent: number) => {
        if (percent >= 80) return "Strong";
        if (percent >= 60) return "Average";
        return "Needs Work";
    };

    return (
        <Card className="overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary transition-all">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">{category}</CardTitle>
                    <Badge variant={percentage >= 80 ? "default" : "secondary"} className={cn(percentage < 60 && "bg-destructive/10 text-destructive hover:bg-destructive/20")}>
                        {score}/{weight} Points
                    </Badge>
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <Progress
                        value={percentage}
                        className={cn(
                            "h-2",
                            `[&>[data-slot=progress-indicator]]:${getStatusColor(percentage)}`
                        )}
                    />
                    <span className="text-xs font-medium text-muted-foreground w-20 text-right">
                        {getStatusText(percentage)}
                    </span>
                </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                {feedback.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            Strengths
                        </h4>
                        <ul className="space-y-1">
                            {feedback.map((item, index) => (
                                <li key={index} className="text-sm text-muted-foreground pl-6 relative before:absolute before:left-2 before:top-2 before:w-1 before:h-1 before:bg-muted-foreground/50 before:rounded-full">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {suggestions.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-dashed">
                        <h4 className="text-sm font-semibold flex items-center gap-2 text-primary">
                            <AlertCircle className="w-4 h-4" />
                            Improvements
                        </h4>
                        <ul className="space-y-2">
                            {suggestions.map((item, index) => (
                                <li key={index} className="text-sm bg-primary/5 p-3 rounded-md border border-primary/10 flex gap-3 items-start">
                                    <ArrowRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
