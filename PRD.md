# Product Requirements Document (PRD) - Resume AI Platform

## 1. Executive Summary
The **Resume Screening & Generation Platform** is an AI-powered tool designed to help job seekers and recruiters evaluate resume fit for software industry roles. It uses **Gemini 2.0** to parse, score, and provide actionable feedback on resumes, and offers a feature to rewrite and generate ATS-friendly resumes.

## 2. Problem Statement
- **Job Seekers** apply blindly without knowing if their resume matches the role or ATS requirements.
- **Recruiters** spend 60-70% of their time manually screening irrelevant resumes.
- **Existing Tools** lack deep "recruiter-like" reasoning, role-specific benchmarking, and integrated rewriting capabilities.

## 3. Product Vision
"Create a simple, intelligent assistant that evaluates a resume like a top recruiter and rewrites it like a world-class career coach."

## 4. Key Features (MVP)

### 4.1 Resume Parsing & Upload
- **Drag & Drop Interface**: Support for PDF and DOCX files.
- **Client-Side Processing**: Privacy-first approach; files are parsed in the browser where possible.
- **OCR Support**: Automatic fallback to Tesseract.js for image-based/scanned PDFs.

### 4.2 AI Analysis Engine
- **Model**: Google Gemini 2.0 Flash.
- **Role-Specific Analysis**: Evaluates resumes against specific software roles (e.g., SDE, Product Manager).
- **Scoring System**: 100-point scale based on 5 weighted categories:
    1.  **Impact & Achievements (30%)**: Quantifiable metrics, action verbs.
    2.  **Skills Match (25%)**: Relevance to modern tech stacks.
    3.  **Experience Quality (25%)**: Progression, tenure, company tier.
    4.  **Education & Certifications (10%)**: Relevance of degree/certs.
    5.  **Formatting & ATS (10%)**: Readability, keyword optimization.

### 4.3 Dashboard & Insights
- **Score Gauge**: Visual representation of the overall fit score.
- **Detailed Feedback**: "Strengths" and "Areas for Improvement" for each category.
- **Actionable Suggestions**: Specific advice on how to improve the score.

### 4.4 Resume Generation (Planned)
- **AI Rewrite**: Rewrites content to be more impactful and concise.
- **Templates**: 5 modern, ATS-friendly designs.
- **PDF Export**: Downloadable, watermarked PDF.

## 5. User Flow
1.  **Upload**: User drags and drops a resume (PDF/DOCX).
2.  **Parse**: System extracts text (with OCR fallback).
3.  **Analyze**: User selects a target role (optional, defaults to General SDE). System sends text to Gemini 2.0.
4.  **Review**: User views the Dashboard with Score, Insights, and Feedback.
5.  **Improve**: User can choose to "Rewrite" the resume using AI.

## 6. Technical Constraints & Decisions
- **Privacy**: No permanent database storage for user files. Session-based data only.
- **Performance**: Client-side parsing to reduce server load and latency.
- **AI Integration**: Server Actions for secure API key handling.

## 7. Success Metrics
- **Completion Rate**: % of users who finish the screening process.
- **Adoption Rate**: % of users who use the "Rewrite" feature.
- **Latency**: Average time from upload to results < 10s.
