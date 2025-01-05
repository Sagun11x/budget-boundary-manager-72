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
    - name (string): subscription name or service
    - cost (number): monthly cost in USD (convert if period is different)
    - description (string): brief description of the service
    - purchaseDate: current date in ISO format
    - renewalPeriod: { number: number, unit: "days" | "weeks" | "months" | "years" }
    
    Example input: "add netflix for 30 days at 12 dollars"
    Should return something like:
    {
      "name": "Netflix",
      "cost": 12,
      "description": "Netflix streaming service subscription",
      "purchaseDate": "2024-01-05",
      "renewalPeriod": {
        "number": 30,
        "unit": "days"
      }
    }
    
    Format as valid JSON. If any field is unclear, use reasonable defaults.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const subscription = JSON.parse(response.text());
    
    // Provide voice feedback about the extracted information
    const feedback = `I'll add a subscription for ${subscription.name} at $${subscription.cost} per ${subscription.renewalPeriod.number} ${subscription.renewalPeriod.unit}`;
    speak(feedback);
    
    return subscription;
  } catch (error) {
    console.error('Error processing voice input:', error);
    speak("Sorry, I couldn't understand that. Please try again.");
    throw new Error('Failed to process voice input');
  }
};