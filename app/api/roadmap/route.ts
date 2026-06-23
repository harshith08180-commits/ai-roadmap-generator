import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { goal } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(
      `Create a simple 3 month roadmap for ${goal}`
    );

    return Response.json({
      roadmap: result.response.text(),
    });
  } catch (error: any) {
    console.error(error);

    return Response.json({
      error: error.message,
    });
  }
}