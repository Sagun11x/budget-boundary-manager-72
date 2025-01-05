import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { speak } from "@/utils/speechUtils";
import { processWithGemini } from "@/utils/geminiUtils";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";

interface VoiceSubscriptionInputProps {
  onSubscriptionData: (data: {
    name: string;
    cost: string;
    renewalNumber: string;
    renewalUnit: "days" | "weeks" | "months" | "years";
  }) => void;
}

export function VoiceSubscriptionInput({ onSubscriptionData }: VoiceSubscriptionInputProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingSubscription, setPendingSubscription] = useState<any>(null);
  const { toast } = useToast();

  const askFollowUpQuestion = async (missingField: string, currentData: any) => {
    try {
      setIsProcessing(true);
      let question = "";
      switch (missingField) {
        case "cost":
          question = `How much does ${currentData.name} cost per ${currentData.renewalUnit}?`;
          break;
        case "period":
          question = `What's the billing period for ${currentData.name} (e.g., monthly, yearly)?`;
          break;
        default:
          question = "Could you please provide more details about the subscription?";
      }

      toast({
        title: "Missing Information",
        description: question,
      });
      speak(question);

      const { startListening } = useVoiceRecognition((answer) => {
        processFollowUpResponse(answer, missingField, currentData);
      });

      startListening();
    } catch (error) {
      console.error('Error in follow-up question:', error);
      setIsProcessing(false);
    }
  };

  const processFollowUpResponse = async (answer: string, missingField: string, currentData: any) => {
    try {
      const prompt = `Extract the ${missingField} information from this answer: "${answer}"
        For cost, return just the number.
        For period, return in format: "number unit" (e.g., "1 month" or "3 months")
        Only respond with the extracted value, nothing else.`;

      const extractedValue = await processWithGemini(prompt);

      const updatedData = { ...currentData };
      if (missingField === "cost") {
        updatedData.cost = extractedValue;
      } else if (missingField === "period") {
        const [number, unit] = extractedValue.split(' ');
        updatedData.renewalNumber = number;
        updatedData.renewalUnit = unit.endsWith('s') ? unit : `${unit}s`;
      }

      if (!updatedData.cost || !updatedData.renewalNumber || !updatedData.renewalUnit) {
        const nextMissingField = !updatedData.cost ? "cost" : "period";
        await askFollowUpQuestion(nextMissingField, updatedData);
      } else {
        const confirmMessage = `Add ${updatedData.name} for $${updatedData.cost} per ${updatedData.renewalNumber} ${updatedData.renewalUnit}?`;
        toast({
          title: "Confirm Subscription",
          description: confirmMessage,
        });
        speak(confirmMessage);
        
        setTimeout(() => {
          onSubscriptionData(updatedData);
          setPendingSubscription(null);
          setIsProcessing(false);
          speak(`Successfully added ${updatedData.name} subscription`);
        }, 3000);
      }
    } catch (error) {
      console.error('Error processing follow-up response:', error);
      setIsProcessing(false);
    }
  };

  const processVoiceInput = async (text: string) => {
    try {
      setIsProcessing(true);
      const prompt = `Extract subscription information from this text: "${text}"
        Format the response exactly like this example:
        {
          "name": "Netflix",
          "cost": "15.99",
          "period": "1 month"
        }
        Only respond with the JSON object, nothing else.`;

      const jsonStr = await processWithGemini(prompt);
      
      try {
        const data = JSON.parse(jsonStr);
        const periodParts = data.period ? data.period.split(' ') : [];
        const subscriptionData = {
          name: data.name,
          cost: data.cost,
          renewalNumber: periodParts[0] || "",
          renewalUnit: periodParts[1] ? (periodParts[1].endsWith('s') ? periodParts[1] : `${periodParts[1]}s`) : "months",
        };

        setPendingSubscription(subscriptionData);

        if (!data.cost) {
          await askFollowUpQuestion("cost", subscriptionData);
        } else if (!data.period) {
          await askFollowUpQuestion("period", subscriptionData);
        } else {
          const confirmMessage = `Add ${data.name} for $${data.cost} per ${data.period}?`;
          toast({
            title: "Confirm Subscription",
            description: confirmMessage,
          });
          speak(confirmMessage);
          
          setTimeout(() => {
            onSubscriptionData(subscriptionData);
            setPendingSubscription(null);
            setIsProcessing(false);
            speak(`Successfully added ${data.name} subscription`);
          }, 3000);
        }
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        toast({
          title: "Error",
          description: "Could not understand the subscription details. Please try again.",
          variant: "destructive",
        });
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Error processing voice input:', error);
      toast({
        title: "Error",
        description: "There was an error processing your voice input. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const { isListening, startListening } = useVoiceRecognition(processVoiceInput);

  return (
    <div className="flex items-center justify-center p-2">
      <Button
        type="button"
        variant={isListening ? "destructive" : "secondary"}
        onClick={startListening}
        disabled={isProcessing}
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
            {isProcessing ? "Processing..." : "Add by Voice"}
          </>
        )}
      </Button>
    </div>
  );
}