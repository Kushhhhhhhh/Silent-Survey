import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey as string);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

export async function GET(request: Request) {
  try {
    const timestamp = Date.now();
    const prompt = `Generate three unique open-ended questions for an anonymous social messaging platform. Each question should be separated by a newline. Ensure the questions are intriguing, avoid personal or sensitive topics, and foster a positive conversational environment. Request ID: ${timestamp}`;

    const generationConfig = {
      maxOutputTokens: 1000,
      temperature: 0.7,
      topP: 0.9,
    };

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt,
            }
          ],
        }
      ],
      generationConfig,
    });

    const text = await result.response.text();
    const messages = text.split("\n").map(msg => msg.trim()).filter(Boolean);
    console.log(`[${timestamp}] Generated messages:`, messages); 

    const headers = new Headers();
    headers.append('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    headers.append('Pragma', 'no-cache');
    headers.append('Expires', '0');
    headers.append('Surrogate-Control', 'no-store');

    return new Response(JSON.stringify({ messages }), { status: 200, headers });
  } catch (error) {
    console.error("An error occurred in generating messages:", error);
    return new Response(JSON.stringify({ error: "Failed to generate messages" }), { status: 500 });
  }
}