# Environment Variables Setup Guide

This guide explains how to configure the Google Gemini API key for both local development and production deployment.

## Local Development Setup

### Step 1: Create `.env.local` file

Create a `.env.local` file in the project root with your Gemini API key:

```bash
NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
```

> **Note**: The `.env.local` file is automatically ignored by Git for security reasons.

### Step 2: Verify Local Setup

Run the development server to test:

```bash
npm run dev
```

Visit `http://localhost:3000` and try uploading a resume to verify the API key is working.

---

## Production Deployment (Vercel)

### Step 1: Access Vercel Dashboard

1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your **ResumeAI** project

### Step 2: Add Environment Variable

1. Click on **Settings** tab
2. Navigate to **Environment Variables** section
3. Click **Add New**

### Step 3: Configure the Variable

Enter the following details:

| Field | Value |
|-------|-------|
| **Key** | `NEXT_PUBLIC_GEMINI_API_KEY` |
| **Value** | `your_actual_api_key_here` |
| **Environments** | ✅ Production, ✅ Preview, ✅ Development |

### Step 4: Save and Redeploy

1. Click **Save**
2. Vercel will automatically trigger a new deployment
3. Wait for the deployment to complete (~2-3 minutes)

---

## Vercel CLI Method (Alternative)

If you prefer using the command line:

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variable
vercel env add NEXT_PUBLIC_GEMINI_API_KEY

# When prompted, paste your actual API key
# Select: Production, Preview, Development (all environments)

# Trigger a new deployment
vercel --prod
```

---

## Verification

### Local Verification
```bash
# Check if the variable is loaded
npm run dev

# In browser console:
console.log(process.env.NEXT_PUBLIC_GEMINI_API_KEY)
# Should output your API key
```

### Production Verification
1. Visit your deployed Vercel URL
2. Upload a test resume (PDF or DOCX)
3. Verify that the analysis completes successfully
4. Check the dashboard displays scores and insights

---

## Security Best Practices

✅ **DO**:
- Keep `.env.local` in `.gitignore`
- Use Vercel's environment variables dashboard for production
- Rotate API keys periodically

❌ **DON'T**:
- Commit `.env.local` to Git
- Share API keys in public repositories
- Use the same key for multiple projects (if possible)

---

## Troubleshooting

### Error: "NEXT_PUBLIC_GEMINI_API_KEY is not set"

**Local**: Ensure `.env.local` exists in the project root with the correct key.

**Production**: 
1. Check Vercel dashboard → Settings → Environment Variables
2. Ensure the variable is set for the correct environment
3. Trigger a new deployment after adding the variable

### Error: "API key invalid"

1. Verify the key matches exactly what you copied from Google AI Studio
2. Check for extra spaces or line breaks
3. Ensure the key hasn't been revoked in Google AI Studio

---

## Additional Notes

- The `NEXT_PUBLIC_` prefix makes the variable accessible in the browser
- Server Actions in `src/app/actions.ts` securely use this key server-side
- The key is used by `src/services/ai.service.ts` to communicate with Gemini API
