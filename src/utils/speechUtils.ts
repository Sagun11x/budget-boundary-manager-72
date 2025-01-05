export const speak = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
};

export const processVoiceInput = async (transcript: string) => {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI("YOUR_API_KEY"); // Replace with your API key
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Extract subscription information from this text: "${transcript}"
    Return a JSON object with these fields:
    - name (string): subscription name
    - cost (number): monthly cost
    - description (string, optional)
    - purchaseDate (string): today's date in ISO format
    - renewalPeriod: { number: 1, unit: "months" }
    Only return the JSON, no other text.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  try {
    const subscription = JSON.parse(text);
    return {
      ...subscription,
      purchaseDate: new Date().toISOString().split('T')[0],
    };
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    throw new Error("Could not parse subscription information");
  }
};