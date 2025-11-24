import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import Tesseract from "tesseract.js";

// Initialize PDF.js worker
if (typeof window !== "undefined") {
    // @ts-ignore
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
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
        throw new Error("Unsupported file type");
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
        const pageText = textContent.items.map((item: any) => item.str).join(" ");

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

async function performOCR(pdf: any): Promise<string> {
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better OCR

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport: viewport }).promise;
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
