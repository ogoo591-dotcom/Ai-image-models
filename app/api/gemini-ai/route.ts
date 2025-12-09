import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY тохируулаагүй байна." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { text } = body as { text?: string };

    if (!text?.trim()) {
      return NextResponse.json(
        { error: "Хоолны нэр эсвэл тайлбар шаардлагатай." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are a chef & food ingredient expert AI.

User will write a food name or short description in ANY language.
Your tasks:
1) Detect the LANGUAGE of the user's input.
2) Return ONLY the ingredient list in that SAME LANGUAGE.
3) Output MUST be a simple bullet list.
4) No explanation, no headings, no extra text.

User input: "${text}"
`;

    const result = await model.generateContent(prompt);
    const ingredients = result.response.text().trim();

    return NextResponse.json({ ingredients }, { status: 200 });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "AI серверийн алдаа. Дараа дахин оролдоно уу." },
      { status: 500 }
    );
  }
}
