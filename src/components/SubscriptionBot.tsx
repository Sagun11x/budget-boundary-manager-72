import { Bot, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import type { Subscription } from "@/types/subscription";

interface SubscriptionBotProps {
  subscriptions: Subscription[];
}

export const SubscriptionBot = ({ subscriptions }: SubscriptionBotProps) => {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-2">
      {showChat && (
        <Card className="w-[300px] p-4 mb-2">
          <div className="space-y-4">
            <p className="text-sm">
              Ask me anything about your subscriptions! I can help you analyze spending,
              find savings opportunities, and manage your subscriptions better.
            </p>
            {/* Chat interface will be implemented here */}
          </div>
        </Card>
      )}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="hidden md:flex hover:bg-gray-100"
          onClick={() => window.open('/info', '_blank')}
        >
          <Info className="h-4 w-4" />
        </Button>
        <Button
          variant="default"
          className="shadow-lg"
          onClick={() => setShowChat(!showChat)}
        >
          <Bot className="h-4 w-4 mr-2" />
          AI Assistant
        </Button>
      </div>
    </div>
  );
};
