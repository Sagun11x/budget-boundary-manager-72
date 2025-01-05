import { GoogleGenerativeAI } from "@google/generative-ai";

export const speak = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
};

export const processVoiceInput = async (text: string) => {
  const genAI = new GoogleGenerativeAI("AIzaSyAJj4ifQOwD-sXWt_tyje6yZZirZr6y-Rg");
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Extract subscription information from this text: "${text}". 
    Return a JSON object with these fields:
    - name (string): subscription name
    - cost (number): monthly cost
    - description (string, optional): brief description
    - renewalPeriod: { number: number, unit: "days" | "weeks" | "months" | "years" }
    
    If any field is unclear, use reasonable defaults. Format as valid JSON.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error('Error processing voice input:', error);
    throw new Error('Failed to process voice input');
  }
};