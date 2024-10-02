import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey as string);

const model = genAI.getGenerativeModel({
    model: "gemini-pro",
});

const generationConfig = {
    temperature: 1.0,
    topP: 1,
    maxOutputTokens: 1000,
};

const prompt = `Generate three unique, thought-provoking questions that encourage self-reflection and meaningful conversation. These questions should be suitable for social interactions or personal journaling. Separate each question with two pipe characters (||).

The questions should:
1. Be open-ended and not have simple yes/no answers
2. Cover a variety of topics such as personal growth, experiences, opinions, or hypothetical scenarios
3. Be engaging and spark interesting discussions
4. Be appropriate for a general audience

Please provide the questions in the following format:
Question 1 || Question 2 || Question 3

Important: Each time this prompt is used, generate completely different questions from any previous responses.`;

export async function GET(request: Request) {
  try {
    const currentTime = new Date().toISOString();
    const dynamicPrompt = `${prompt}\n\nCurrent timestamp: ${currentTime}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: dynamicPrompt }]}],
      generationConfig,
    });
    const response = await result.response;
    const text = response.text();
    const messages = [text];

    const headers = new Headers({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    });

    return new Response(JSON.stringify({ messages }), { status: 200, headers });
  } catch (error) {
    console.error("An error occurred in generating messages:", error);
    return new Response(JSON.stringify({ error: "Failed to generate messages" }), { status: 500 });
  }
}