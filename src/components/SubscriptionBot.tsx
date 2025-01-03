import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send, Volume2, VolumeX } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface SubscriptionBotProps {
  subscriptions: Array<{
    name: string;
    cost: number;
    renewalPeriod: {
      number: number;
      unit: string;
    };
  }>;
}

export const SubscriptionBot = ({ subscriptions }: SubscriptionBotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const getSubscriptionContext = () => {
    const totalMonthly = subscriptions.reduce((acc, sub) => acc + sub.cost, 0);
    return `Current context: You have ${subscriptions.length} subscriptions with a total monthly cost of $${totalMonthly}. 
    The subscriptions are: ${subscriptions.map(sub => `${sub.name} ($${sub.cost}/month)`).join(", ")}.
    Please provide a brief and focused response in 2-3 sentences maximum.`;
  };

  const handleSendMessage = async () => {
    try {
      setIsLoading(true);
      // Using the demo API key for testing
      const genAI = new GoogleGenerativeAI("AIzaSyAJj4ifQOwD-sXWt_tyje6yZZirZr6y-Rg");
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const context = getSubscriptionContext();
      const prompt = `${context}\n\nUser question: ${message}\n\nPlease provide a helpful response about their subscriptions. If they ask about reducing costs, analyze their subscriptions and suggest specific ways to save money.`;

      const result = await model.generateContent(prompt);
      const apiResponse = await result.response;
      setResponse(apiResponse.text());
    } catch (error) {
      console.error("Error generating response:", error);
      setResponse("Sorry, I encountered an error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const speakResponse = async () => {
    try {
      setIsSpeaking(true);
      const apiResponse = await fetch("https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": import.meta.env.VITE_ELEVEN_LABS_API_KEY || "", // Use the API key from environment
        },
        body: JSON.stringify({
          text: response,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      });

      if (!apiResponse.ok) {
        throw new Error("Failed to generate speech");
      }

      const audioBlob = await apiResponse.blob();
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audio.onended = () => setIsSpeaking(false);
      audio.play();
    } catch (error) {
      console.error("Error generating speech:", error);
      setIsSpeaking(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full p-4"
        variant="default"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 p-4 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Subscription Assistant</h3>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {response && (
          <div className="bg-muted rounded-lg p-3 text-sm">
            <div className="flex justify-between items-start">
              <div className="flex-1 mr-2">{response}</div>
              <Button
                variant="ghost"
                size="icon"
                onClick={speakResponse}
                disabled={isLoading || isSpeaking}
              >
                {isSpeaking ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about your subscriptions..."
            className="min-h-[80px]"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || !message.trim()}
            className="self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};