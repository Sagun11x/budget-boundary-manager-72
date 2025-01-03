import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send } from "lucide-react";
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

  const getSubscriptionContext = () => {
    const totalMonthly = subscriptions.reduce((acc, sub) => acc + sub.cost, 0);
    return `Current context: You have ${subscriptions.length} subscriptions with a total monthly cost of $${totalMonthly}. 
    The subscriptions are: ${subscriptions.map(sub => `${sub.name} ($${sub.cost}/month)`).join(", ")}.`;
  };

  const handleSendMessage = async () => {
    try {
      setIsLoading(true);
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const context = getSubscriptionContext();
      const prompt = `${context}\n\nUser question: ${message}\n\nPlease provide a helpful response about their subscriptions. If they ask about reducing costs, analyze their subscriptions and suggest specific ways to save money.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      setResponse(response.text());
    } catch (error) {
      console.error("Error generating response:", error);
      setResponse("Sorry, I encountered an error. Please try again later.");
    } finally {
      setIsLoading(false);
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
            {response}
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