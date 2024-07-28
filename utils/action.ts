/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, GenerativeModel } from "@google/generative-ai";

const apiKey: string = "AIzaSyCNxL1UQlsV8ojQNJO4ViU3SyjqrVrr7Yw";
const genAI = new GoogleGenerativeAI(apiKey);

const model: GenerativeModel = genAI.getGenerativeModel({
  model: "tunedModels/corex-ai-nmtokm4xescc",
});

const generationConfig = {
  temperature: 0.9,
  topP: 1,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

interface Part {
  text: string;
}

export async function run(userPrompt: string, history: Part[]): Promise<string> {
  const parts: Part[] = [
    ...history,
    { text: `input: ${userPrompt}` },
  ];

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
    });
    return result.response.text;
  } catch (error) {
    console.error('Error generating content:', error);
    return "An error occurred while generating the response.";
  }
}
