import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import Tesseract from "tesseract.js";
import { ValidationError } from "@/lib/errors";

// Initialize PDF.js worker
if (typeof window !== "undefined") {
    // Use local worker file for better reliability
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}

export async function parseResume(file: File): Promise<string> {
    const fileType = file.type;

    if (fileType === "application/pdf") {
        return parsePDF(file);
    } else if (
        fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
        return parseDOCX(file);
    } else {
        throw new ValidationError("Unsupported file type. Please upload a PDF or DOCX file.");
    }
}

async function parsePDF(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";
    let hasText = false;

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
            .map((item) => {
                // Type guard for TextItem (has str property)
                if ('str' in item) {
                    return (item as { str: string }).str;
                }
                return '';
            })
            .join(" ");

        if (pageText.trim().length > 50) {
            hasText = true;
        }
        fullText += pageText + "\n";
    }

    // If very little text was found, try OCR
    if (!hasText || fullText.trim().length < 100) {
        console.log("Little text found, attempting OCR...");
        fullText = await performOCR(pdf);
    }

    return fullText;
}

async function performOCR(pdf: Awaited<ReturnType<typeof pdfjsLib.getDocument>['promise']>): Promise<string> {
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better OCR

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
            canvas: canvas,
            canvasContext: context,
            viewport: viewport,
        }).promise;
        const result = await Tesseract.recognize(canvas, "eng");
        fullText += result.data.text + "\n";
    }

    return fullText;
}

async function parseDOCX(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
}
