import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { useConversation } from "@11labs/react";
import { useToast } from "@/components/ui/use-toast";

interface VoiceSubscriptionInputProps {
  onSubscriptionData: (data: {
    name: string;
    cost: string;
    renewalNumber: string;
    renewalUnit: "days" | "weeks" | "months" | "years";
  }) => void;
}

export function VoiceSubscriptionInput({ onSubscriptionData }: VoiceSubscriptionInputProps) {
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();
  const conversation = useConversation({
    onMessage: (message) => {
      if (message.type === "llm_response") {
        try {
          // Extract subscription details from the AI response
          const response = message.content;
          const nameMatch = response.match(/name:\s*"([^"]+)"/);
          const costMatch = response.match(/cost:\s*"([^"]+)"/);
          const periodMatch = response.match(/period:\s*"(\d+)\s+([^"]+)"/);

          if (nameMatch && costMatch && periodMatch) {
            const name = nameMatch[1];
            const cost = costMatch[1].replace(/[^0-9.]/g, '');
            const renewalNumber = periodMatch[1];
            const renewalUnit = periodMatch[2].toLowerCase() as "days" | "weeks" | "months" | "years";

            onSubscriptionData({
              name,
              cost,
              renewalNumber,
              renewalUnit: renewalUnit.endsWith('s') ? renewalUnit.slice(0, -1) as any : renewalUnit,
            });

            setIsListening(false);
          }
        } catch (error) {
          console.error('Error parsing voice input:', error);
          toast({
            title: "Error",
            description: "Could not understand the subscription details. Please try again.",
            variant: "destructive",
          });
        }
      }
    },
    onError: (error) => {
      console.error('Voice conversation error:', error);
      toast({
        title: "Error",
        description: "There was an error with the voice input. Please try again.",
        variant: "destructive",
      });
      setIsListening(false);
    }
  });

  const handleVoiceInput = async () => {
    try {
      if (!isListening) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        await conversation.startSession({
          agentId: "subscription-helper", // Replace with your ElevenLabs agent ID
        });
        setIsListening(true);
        toast({
          title: "Listening",
          description: "Speak your subscription details...",
        });
      } else {
        await conversation.endSession();
        setIsListening(false);
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Error",
        description: "Could not access microphone. Please check your permissions.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center p-2">
      <Button
        type="button"
        variant={isListening ? "destructive" : "secondary"}
        onClick={handleVoiceInput}
        className="flex items-center gap-2"
      >
        {isListening ? (
          <>
            <MicOff className="w-4 h-4" />
            Stop Recording
          </>
        ) : (
          <>
            <Mic className="w-4 h-4" />
            Add by Voice
          </>
        )}
      </Button>
    </div>
  );
}