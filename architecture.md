# System Architecture & Tech Stack

## 1. Architecture Overview

The Resume AI Platform follows a **Modern Web Application** architecture using Next.js 14 (App Router). It emphasizes **Client-Side Processing** for file handling to ensure privacy and **Server-Side AI Integration** for security.

### High-Level Diagram

```mermaid
graph TD
    User[User] -->|Uploads PDF/DOCX| Client[Client (Next.js)]
    
    subgraph "Frontend (Browser)"
        Client -->|Drag & Drop| FileUpload[File Upload Component]
        FileUpload -->|Parse| Parser[Parser Utility (pdfjs/mammoth)]
        Parser -->|Fallback OCR| Tesseract[Tesseract.js]
        Parser -->|Extracted Text| Store[Zustand Store]
    end
    
    subgraph "Backend (Server Actions)"
        Client -->|Analyze Request| Action[Server Action (actions.ts)]
        Action -->|Delegate| Service[AI Service (ai.service.ts)]
        Service -->|Load Prompt| Prompts[Prompt Files (.txt)]
        Service -->|API Call| Gemini[Gemini 2.0 API]
    end
    
    Gemini -->|JSON Response| Service
    Service -->|Analysis Result| Action
    Action -->|Update State| Store
    Store -->|Render| Dashboard[Dashboard UI]
```

## 2. Tech Stack & Decisions

### Core Framework: **Next.js 14 (App Router)**
- **Why**: Provides a robust framework for both frontend UI and backend API routes (Server Actions). The App Router offers better performance and simplified routing.
- **Role**: Handles routing, server-side rendering, and API integration.

### Language: **TypeScript**
- **Why**: Ensures type safety across the entire application, especially critical when handling complex JSON structures from the AI API.
- **Role**: Used for all components, utilities, and services. Shared types in `src/types/`.

### Styling: **Tailwind CSS + Shadcn/UI**
- **Why**: 
    - **Tailwind**: Rapid styling with utility classes.
    - **Shadcn/UI**: Provides accessible, high-quality, copy-pasteable components (Radix UI primitives) that give the app a "premium" feel without external library bloat.
- **Role**: UI components (Cards, Buttons, Dialogs) and layout styling.

### State Management: **Zustand**
- **Why**: Lightweight, simple, and supports persistence (local storage) out of the box. Much simpler than Redux for this use case.
- **Role**: Manages session state (uploaded file, extracted text, analysis results) across pages.

### AI Integration: **Google Gemini 2.0 Flash**
- **Why**: 
    - **Speed**: "Flash" model is optimized for low latency, essential for real-time user feedback.
    - **Context Window**: Large context window handles long resumes easily.
    - **Cost/Performance**: Excellent balance for text analysis and generation tasks.
- **Role**: Performs resume analysis, scoring, and rewriting.

### File Parsing
- **PDF**: `pdfjs-dist` (Standard parsing) + `tesseract.js` (OCR fallback).
- **DOCX**: `mammoth` (Text extraction).
- **Why Client-Side?**: 
    - **Privacy**: Files are processed in the user's browser; raw files are never sent to the server.
    - **Efficiency**: Reduces server bandwidth and processing load.

## 3. Key Design Patterns

### Service Layer Pattern
- **Implementation**: `src/services/ai.service.ts`
- **Purpose**: Decouples business logic (AI interaction, prompt management) from the transport layer (Server Actions). Makes the code testable and reusable.

### Server Actions
- **Implementation**: `src/app/actions.ts`
- **Purpose**: Securely exposes server-side functionality to the client without creating REST API endpoints manually. Handles environment variables (API Keys) securely.

### Prompt Engineering
- **Implementation**: `src/prompts/*.txt`
- **Purpose**: Prompts are stored as external text files, separating "data" from "code". This allows for easier iteration on prompts without redeploying the application logic.
