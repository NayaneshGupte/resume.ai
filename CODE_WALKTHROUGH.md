# Code Walkthrough & Developer Guide

This guide explains the structure, flow, and key technical decisions of the Resume AI Platform.

## 1. Directory Structure

- **`src/app/`**: Next.js App Router pages and layouts.
    - `page.tsx`: The landing page containing the file upload flow.
    - `dashboard/page.tsx`: The results page displaying scores and insights.
    - `actions.ts`: Server Actions that act as the bridge between frontend and backend services.
- **`src/components/`**: React components.
    - `features/`: Feature-specific components.
        - `upload/`: `file-upload.tsx` (Drag & Drop logic).
        - `analysis/`: `score-gauge.tsx`, `insight-card.tsx` (Visualization).
    - `ui/`: Reusable UI components (Buttons, Cards) from Shadcn/UI.
- **`src/lib/`**: Utility functions.
    - `parser.ts`: Logic for extracting text from PDF and DOCX files.
    - `store.ts`: Zustand store for managing application state.
    - `utils.ts`: Helper functions (e.g., class name merging).
- **`src/services/`**: Business logic.
    - `ai.service.ts`: Handles communication with Google Gemini API.
- **`src/types/`**: TypeScript definitions.
    - `resume.ts`: Shared interfaces for Resume and Analysis data.
- **`src/prompts/`**: Text files containing the system prompts for the AI.

## 2. Key Workflows

### A. Resume Upload & Parsing
**File**: `src/app/page.tsx` -> `src/components/features/upload/file-upload.tsx` -> `src/lib/parser.ts`

1.  **User Action**: User drags and drops a file in the `FileUpload` component.
2.  **Event Handling**: `handleFileSelect` in `page.tsx` receives the file and calls `parseResume` from `parser.ts`.
3.  **Parsing Logic** (`src/lib/parser.ts`):
    - **PDF**: Uses `pdfjs-dist` to render and extract text from each page.
    - **OCR Fallback**: If the extracted text length is < 50 characters (indicating a scanned image), it triggers `tesseract.js` to perform OCR on the rendered canvas.
    - **DOCX**: Uses `mammoth` to extract raw text from Word documents.
4.  **State Update**: The extracted text is saved to the global Zustand store (`useResumeStore`).

### B. AI Analysis
**File**: `src/app/page.tsx` -> `src/app/actions.ts` -> `src/services/ai.service.ts`

1.  **Trigger**: After successful parsing, `page.tsx` calls the Server Action `analyzeResumeAction`.
2.  **Server Action** (`src/app/actions.ts`): Acts as a secure gateway, calling `aiService.analyzeResume`.
3.  **AI Service** (`src/services/ai.service.ts`):
    - **Prompt Loading**: Reads the prompt template from `src/prompts/analyze-resume.txt`.
    - **Injection**: Replaces `{{role}}` and `{{text}}` placeholders with actual data.
    - **API Call**: Sends the prompt to Google's `gemini-2.0-flash-exp` model.
    - **Response Handling**: Cleans the markdown code blocks from the response and parses the JSON.
4.  **Result**: The structured `AnalysisResult` is returned to the frontend and stored in Zustand.
5.  **Navigation**: The user is redirected to `/dashboard`.

### C. Dashboard Visualization
**File**: `src/app/dashboard/page.tsx`

1.  **Data Retrieval**: The page retrieves `analysis` data from `useResumeStore`.
2.  **Score Visualization**: Renders `ScoreGauge` to show the total score (0-100) with an animated SVG circle.
3.  **Insights**: Iterates through `analysis.categories` to render `InsightCard`s.
    - Each card displays the category score, specific feedback points, and actionable improvement suggestions.

## 3. Key Technical Decisions

### Client-Side Parsing
We chose to parse files in the browser (Client-Side) rather than uploading them to a server.
- **Privacy**: The user's original file never leaves their device. Only the extracted text is sent to the AI for analysis.
- **Performance**: Reduces server bandwidth and storage costs.

### Server Actions for AI
We use Next.js Server Actions to handle the Gemini API calls.
- **Security**: Keeps the `NEXT_PUBLIC_GEMINI_API_KEY` (or `GEMINI_API_KEY`) secure on the server.
- **Simplicity**: No need to manually create API routes (`pages/api/...`).

### Externalized Prompts
Prompts are stored as `.txt` files in `src/prompts/`.
- **Maintainability**: Prompts can be edited and versioned independently of the code.
- **Clarity**: Keeps the TypeScript code clean and focused on logic.

### Zustand for State
We use Zustand with `persist` middleware.
- **Persistence**: Ensures that if the user refreshes the dashboard, their analysis results are not lost.
- **Simplicity**: Minimal boilerplate compared to Redux or Context API.
