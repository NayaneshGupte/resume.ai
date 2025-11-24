"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    isUploading?: boolean;
}

export function FileUpload({ onFileSelect, isUploading = false }: FileUploadProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) {
                    toast.error("File size too large. Max 5MB.");
                    return;
                }
                setSelectedFile(file);
                onFileSelect(file);
            }
        },
        [onFileSelect]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
                ".docx",
            ],
        },
        maxFiles: 1,
        multiple: false,
        disabled: isUploading,
    });

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedFile(null);
    };

    return (
        <div className="w-full max-w-xl mx-auto">
            <Card
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed transition-colors cursor-pointer hover:border-primary/50",
                    isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                    isUploading && "opacity-50 cursor-not-allowed"
                )}
            >
                <CardContent className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                    <input {...getInputProps()} />

                    {selectedFile ? (
                        <div className="flex items-center gap-4 p-4 border rounded-lg bg-background w-full max-w-sm relative">
                            <div className="p-2 rounded-full bg-primary/10">
                                <FileText className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1 text-left min-w-0">
                                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                            {!isUploading && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    onClick={removeFile}
                                >
                                    <X className="w-3 h-3" />
                                </Button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="p-4 rounded-full bg-primary/10">
                                <Upload className="w-8 h-8 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-lg font-medium">
                                    {isDragActive ? "Drop the resume here" : "Upload your resume"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Drag & drop or click to browse (PDF, DOCX)
                                </p>
                            </div>
                        </>
                    )}

                    {isUploading && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Analyzing resume...
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
