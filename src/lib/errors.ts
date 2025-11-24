import { toast } from "sonner";

export class AppError extends Error {
    constructor(message: string, public code?: string, public originalError?: unknown) {
        super(message);
        this.name = "AppError";
    }
}

export class AIError extends AppError {
    constructor(message: string, originalError?: unknown) {
        super(message, "AI_ERROR", originalError);
        this.name = "AIError";
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, "VALIDATION_ERROR");
        this.name = "ValidationError";
    }
}

export class NetworkError extends AppError {
    constructor(message: string = "Network connection failed. Please check your internet.") {
        super(message, "NETWORK_ERROR");
        this.name = "NetworkError";
    }
}

export function handleError(error: unknown): string {
    console.error("Global Error Handler:", error);

    if (error instanceof AppError) {
        return error.message;
    }

    if (error instanceof Error) {
        // Handle specific known error patterns
        if (error.message.includes("429") || error.message.includes("quota")) {
            return "AI Usage Limit Exceeded. Please wait a minute and try again.";
        }
        if (error.message.includes("fetch") || error.message.includes("network")) {
            return "Network error. Please check your connection.";
        }
        return error.message;
    }

    if (typeof error === "string") {
        return error;
    }

    return "An unexpected error occurred. Please try again.";
}

export function showErrorToast(error: unknown) {
    const message = handleError(error);
    toast.error(message);
}
