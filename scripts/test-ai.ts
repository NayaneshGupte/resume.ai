import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ NEXT_PUBLIC_GEMINI_API_KEY is missing in .env.local");
    process.exit(1);
}

console.log("✅ Found API Key:", apiKey.substring(0, 5) + "...");

async function testAI() {
    try {
        const genAI = new GoogleGenerativeAI(apiKey!);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        console.log("🤖 Testing Gemini 2.0 Flash Exp...");
        const result = await model.generateContent("Say 'Hello, World!' if you can hear me.");
        const response = await result.response;
        console.log("✅ AI Response:", response.text());
    } catch (error: any) {
        console.error("❌ AI Test Failed:", error.message);
    }
}

testAI();
