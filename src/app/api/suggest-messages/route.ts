import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("GEMINI_API_KEY is not set in the environment variables");
  throw new Error("GEMINI_API_KEY is missing");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-pro",
});

const generationConfig = {
    temperature: 0.8,
    topP: 1,
    maxOutputTokens: 200,
};

const prompt = `Create a list of two open-ended and engaging questions formatted as a single string. These questions should be separated by '||'. These questions are for an anonymous social messaging platform and should be suitable for a diverse audience. Avoid personal and sensitive topics, focusing instead on universal themes. This will encourage friendly interaction. 

Your output should be structured like this:
What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be?

Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.`;

export async function GET(request: Request) {
  console.log("Received GET request for suggest-messages");
  try {
    const currentTime = new Date().toISOString();
    const dynamicPrompt = `${prompt}\n\nCurrent timestamp: ${currentTime}`;

    console.log("Generating content with dynamic prompt:", dynamicPrompt);
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: dynamicPrompt }]}],
      generationConfig,
    });
    const response = await result.response;
    const text = response.text();
    
    console.log("Generated text:", text);
    const questions = text.split('||').map(question => question.trim());

    if (questions.length !== 2) {
      console.warn("Generated content does not contain exactly two questions");
      return new Response(JSON.stringify({ error: "Invalid generated content" }), { status: 500 });
    }

    const headers = new Headers({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    });

    console.log("Returning generated questions:", questions);
    return new Response(JSON.stringify({ messages: questions }), { status: 200, headers });
  } catch (error) {
    console.error("An error occurred in generating messages:", error);
    return new Response(JSON.stringify({ error: "Failed to generate messages" }), { status: 500 });
  }
}