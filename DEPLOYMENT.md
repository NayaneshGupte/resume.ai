# Deployment Guide - Resume AI Platform

This guide outlines the steps to deploy the Resume AI Platform. It is divided into two main sections: **Local Deployment** for development and testing, and **Production Deployment** for going live.

## 1. Prerequisites

Before you begin, ensure you have the following:

- **Node.js**: Version 18.17 or later installed ([Download](https://nodejs.org/)).
- **Git**: Installed and configured.
- **Gemini API Key**: A valid API key from [Google AI Studio](https://aistudio.google.com/).
- **GitHub Account**: For hosting your repository.
- **Vercel Account**: For production deployment (recommended).

## 2. Environment Variables

The application requires the following environment variables.

| Variable | Description | Required? |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Your Google Gemini API Key. | **Yes** |

---

## 3. Local Deployment

Use this section to run the application on your own machine for development or testing purposes.

### Step 1: Clone the Repository
Open your terminal and run:
```bash
git clone <your-repo-url>
cd resume-ai-platform
```

### Step 2: Install Dependencies
Install the necessary Node.js packages:
```bash
npm install
# or
yarn install
# or
pnpm install
```

### Step 3: Configure Environment
1.  Create a file named `.env.local` in the root directory.
2.  Add your API key to the file:
    ```env
    NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
    ```

### Step 4: Run in Development Mode
Start the development server with hot-reloading:
```bash
npm run dev
```
- Open [http://localhost:3000](http://localhost:3000) in your browser.
- Changes to code will automatically update the page.

### Step 5: Run in Production Mode (Locally)
To simulate the production environment locally (optimized build):
```bash
# Build the application
npm run build

# Start the production server
npm start
```
- The app will be available at [http://localhost:3000](http://localhost:3000).
- This mode is faster than dev mode but does not support hot-reloading.

---

## 4. Production Deployment

Use this section to deploy your application to the public internet. We recommend **Vercel** as it is optimized for Next.js.

### Option A: Deploying to Vercel (Recommended)

#### Step 1: Push to GitHub
Ensure your latest code is committed and pushed to your GitHub repository.
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### Step 2: Import Project to Vercel
1.  Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Select your GitHub repository (`resume-ai-platform`) and click **"Import"**.

#### Step 3: Configure Deployment
1.  **Framework Preset**: Ensure "Next.js" is selected.
2.  **Root Directory**: Leave blank (unless your app is in a subfolder).
3.  **Environment Variables**:
    - Expand the "Environment Variables" section.
    - **Key**: `NEXT_PUBLIC_GEMINI_API_KEY`
    - **Value**: Paste your actual API key from Google AI Studio.
    - Click **"Add"**.

#### Step 4: Deploy
1.  Click **"Deploy"**.
2.  Wait for the build to complete (approx. 1-2 minutes).
3.  Once finished, Vercel will provide a **Production URL** (e.g., `https://resume-ai-platform.vercel.app`).

### Option B: Docker Deployment (Alternative)

If you prefer to host on a VPS (AWS, DigitalOcean, etc.) using Docker:

1.  **Build the Image**:
    ```bash
    docker build -t resume-ai .
    ```
2.  **Run the Container**:
    ```bash
    docker run -p 3000:3000 -e NEXT_PUBLIC_GEMINI_API_KEY=your_key resume-ai
    ```

## 5. Troubleshooting

### Common Issues

- **500 Internal Server Error**: Usually indicates a missing or invalid API Key. Check your Vercel Environment Variables.
- **Build Failed**: Run `npm run build` locally to check for TypeScript errors before pushing.
- **"Module not found"**: Ensure you have run `npm install` and that all dependencies are listed in `package.json`.
