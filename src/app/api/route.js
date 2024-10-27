import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

//Load environment variables
const genAI = new GoogleGenerativeAI(process.env.GIMINI_API_KEY);



export async function POST(req) {
  try {
    const KeywordResult = await req.json();
    const prompt = `Analyze the following keywords with metrics: ${JSON.stringify(KeywordResult.body)}. Provide insights on search trends, competition, and suggest potential actions for each keyword. output in french`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    // Return a plain JavaScript object instead of a React component or DOM element
    return NextResponse.json({
      analysis: result.response.candidates[0].content.parts[0].text
    });
  } catch (error) {
    console.error("Error during keyword analysis:", error);
    return NextResponse.json({ error: "Failed to analyze keywords" }, { status: 500 });
  }
}