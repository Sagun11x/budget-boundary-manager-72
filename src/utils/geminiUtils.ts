import { GoogleGenerativeAI } from "@google/generative-ai";

export const processWithGemini = async (prompt: string) => {
  const genAI = new GoogleGenerativeAI("AIzaSyAJj4ifQOwD-sXWt_tyje6yZZirZr6y-Rg");
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
};