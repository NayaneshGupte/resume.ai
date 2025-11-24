# Resume AI Platform 🚀

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Gemini](https://img.shields.io/badge/AI-Gemini%202.0-orange)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8)
![Tests](https://img.shields.io/badge/Tests-Passing-success)

**Resume AI Platform** is an intelligent, privacy-first tool designed to help job seekers and recruiters evaluate resume fit for software industry roles. Powered by **Google Gemini 2.0**, it parses resumes, provides "recruiter-grade" scoring, and offers actionable feedback to improve your chances of getting hired.

---

## 📚 Documentation

We have detailed documentation to help you understand, run, and deploy the project:

- **[Product Requirements (PRD)](./PRD.md)**: The vision, problem statement, and detailed feature requirements.
- **[System Architecture](./architecture.md)**: High-level diagrams and explanation of the tech stack and design choices.
- **[Code Walkthrough](./CODE_WALKTHROUGH.md)**: A developer's guide to the codebase structure and key data flows.
- **[Deployment Guide](./DEPLOYMENT.md)**: Step-by-step instructions for running locally and deploying to Vercel.
- **[Environment Setup](./ENV_SETUP.md)**: Guide for configuring API keys for local and production environments.
- **[Test Results](./testresults.md)**: Comprehensive testing report with all test results.

---

## ✨ Key Features

- **📄 Universal Parsing**: Drag-and-drop support for PDF and DOCX files.
- **👁️ OCR Capabilities**: Automatically handles image-based or scanned resumes using Tesseract.js.
- **🤖 AI Analysis**: Uses **Gemini 2.0 Flash** to evaluate resumes against specific roles (e.g., SDE, PM).
- **📊 Smart Scoring**: 100-point scoring system based on Impact, Skills, Experience, and ATS compatibility.
- **💡 Actionable Insights**: Provides specific "Strengths" and "Areas for Improvement" for every category.
- **🔒 Privacy First**: All file parsing happens in the browser. Your resume is never stored on our servers.
- **✅ Fully Tested**: Comprehensive unit and E2E test coverage with Jest and Playwright.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router with Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/UI](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **AI Model**: [Google Gemini 2.0 Flash](https://deepmind.google/technologies/gemini/)
- **Parsing**: `pdfjs-dist`, `mammoth`, `tesseract.js`
- **Testing**: Jest, React Testing Library, Playwright
- **Deployment**: Vercel (Edge Network)

---

## 🚀 Quick Start

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/NayaneshGupte/ResumeAI.git
    cd ResumeAI
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**:
    Create a `.env.local` file and add your Gemini API Key:
    ```env
    NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
    ```
    See [ENV_SETUP.md](./ENV_SETUP.md) for detailed instructions.

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Run all tests
npm run test:all
```

See [testresults.md](./testresults.md) for detailed test coverage.

---

## 🤝 Contributing

Contributions are welcome! Please check the [Code Walkthrough](./CODE_WALKTHROUGH.md) to understand the project structure before making changes.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
