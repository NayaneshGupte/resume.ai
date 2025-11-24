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

> **For detailed environment setup instructions**, see [ENV_SETUP.md](./ENV_SETUP.md).

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
```

### Step 3: Configure Environment Variables

See **[ENV_SETUP.md](./ENV_SETUP.md)** for detailed instructions on setting up your Gemini API key.

**Quick setup**:
```bash
echo "NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here" > .env.local
```

### Step 4: Run in Development Mode
Start the development server with hot-reloading:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 5: Run in Production Mode (Locally)
To simulate the production environment locally:
```bash
npm run build && npm start
```

---

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

#### Step 3: Configure Environment Variables

See **[ENV_SETUP.md](./ENV_SETUP.md)** for detailed instructions.

**Quick setup**:
1. In Vercel dashboard, go to **Settings** → **Environment Variables**
2. Add: `NEXT_PUBLIC_GEMINI_API_KEY` = `your_actual_api_key_here`
3. Select all environments (Production, Preview, Development)

#### Step 4: Deploy
1. Click **"Deploy"**
2. Wait for build completion (~1-2 minutes)
3. Access your production URL

---

## 5. Troubleshooting

### Common Issues

- **Environment Variable Errors**: See [ENV_SETUP.md](./ENV_SETUP.md) for detailed troubleshooting.
- **Build Failed**: Run `npm run build` locally to check for errors before deploying.
- **Module Not Found**: Ensure `npm install` has been run and all dependencies are in `package.json`.
- **TypeScript Errors**: Run `npx tsc --noEmit` to check for type errors.

For more detailed troubleshooting, see:
- **[ENV_SETUP.md](./ENV_SETUP.md)** - Environment variable issues
- **[testresults.md](./testresults.md)** - Test failures and fixes
