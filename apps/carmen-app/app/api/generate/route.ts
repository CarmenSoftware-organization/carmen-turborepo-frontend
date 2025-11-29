import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY });

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return Response.json({ text: response.text });
  } catch (error) {
    console.error("AI Generation Error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to generate text" },
      { status: 500 }
    );
  }
}
