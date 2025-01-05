import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send, Info } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { InfoModal } from "./InfoModal";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const getSubscriptionContext = () => {
    const totalMonthly = subscriptions.reduce((acc, sub) => acc + sub.cost, 0);
    return `Current context: You have ${subscriptions.length} subscriptions with a total monthly cost of $${totalMonthly}. 
    The subscriptions are: ${subscriptions.map(sub => `${sub.name} ($${sub.cost}/month)`).join(", ")}.
    Please provide a brief and focused response in 2-3 sentences maximum.`;
  };

  const handleSendMessage = async () => {
    try {
      setIsLoading(true);
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

  return (
    <>
      {!isChatOpen ? (
        <div className="fixed bottom-4 right-4 flex gap-2">
          <Button
            onClick={() => setIsChatOpen(true)}
            className="rounded-full p-4"
            variant="default"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
          {!isMobile && (
            <Button
              onClick={() => setShowInfo(true)}
              className="rounded-full p-4"
              variant="outline"
            >
              <Info className="h-6 w-6" />
            </Button>
          )}
        </div>
      ) : (
        <Card className="fixed bottom-4 right-4 w-80 p-4 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Subscription Assistant</h3>
            <div className="flex gap-2">
              {!isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowInfo(true)}
                >
                  <Info className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => setIsChatOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {response && (
              <div className="bg-muted rounded-lg p-3 text-sm">
                <div className="flex-1">{response}</div>
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
      )}

      <InfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} />
    </>
  );
};