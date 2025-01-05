import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingSubscription, setPendingSubscription] = useState<any>(null);
  const { toast } = useToast();

  const askFollowUpQuestion = async (missingField: string, currentData: any) => {
    try {
      setIsProcessing(true);
      const genAI = new GoogleGenerativeAI("AIzaSyAJj4ifQOwD-sXWt_tyje6yZZirZr6y-Rg");
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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

      // Start listening for the answer
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const answer = event.results[0][0].transcript;
        processFollowUpResponse(answer, missingField, currentData);
      };

      recognition.onerror = (event: SpeechRecognitionEvent) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Error",
          description: "There was an error with the voice input. Please try again.",
          variant: "destructive",
        });
        setIsProcessing(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      await navigator.mediaDevices.getUserMedia({ audio: true });
      recognition.start();
      setIsListening(true);
    } catch (error) {
      console.error('Error in follow-up question:', error);
      setIsProcessing(false);
    }
  };

  const processFollowUpResponse = async (answer: string, missingField: string, currentData: any) => {
    try {
      const genAI = new GoogleGenerativeAI("AIzaSyAJj4ifQOwD-sXWt_tyje6yZZirZr6y-Rg");
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `Extract the ${missingField} information from this answer: "${answer}"
        For cost, return just the number.
        For period, return in format: "number unit" (e.g., "1 month" or "3 months")
        Only respond with the extracted value, nothing else.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const extractedValue = response.text().trim();

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
        // All information is complete
        toast({
          title: "Confirm Subscription",
          description: `Add ${updatedData.name} for $${updatedData.cost} per ${updatedData.renewalNumber} ${updatedData.renewalUnit}?`,
        });
        
        // Wait for 3 seconds for user to see the confirmation
        setTimeout(() => {
          onSubscriptionData(updatedData);
          setPendingSubscription(null);
          setIsProcessing(false);
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
      const genAI = new GoogleGenerativeAI("AIzaSyAJj4ifQOwD-sXWt_tyje6yZZirZr6y-Rg");
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `Extract subscription information from this text: "${text}"
        Format the response exactly like this example:
        {
          "name": "Netflix",
          "cost": "15.99",
          "period": "1 month"
        }
        Only respond with the JSON object, nothing else.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const jsonStr = response.text();
      
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

        // Check for missing information
        if (!data.cost) {
          await askFollowUpQuestion("cost", subscriptionData);
        } else if (!data.period) {
          await askFollowUpQuestion("period", subscriptionData);
        } else {
          // All information is present
          toast({
            title: "Confirm Subscription",
            description: `Add ${data.name} for $${data.cost} per ${data.period}?`,
          });
          
          // Wait for 3 seconds for user to see the confirmation
          setTimeout(() => {
            onSubscriptionData(subscriptionData);
            setPendingSubscription(null);
            setIsProcessing(false);
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

  const handleVoiceInput = async () => {
    try {
      if (!isListening && !isProcessing) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
          throw new Error('Speech recognition not supported');
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          processVoiceInput(transcript);
        };

        recognition.onerror = (event: SpeechRecognitionEvent) => {
          console.error('Speech recognition error:', event.error);
          toast({
            title: "Error",
            description: "There was an error with the voice input. Please try again.",
            variant: "destructive",
          });
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        await navigator.mediaDevices.getUserMedia({ audio: true });
        recognition.start();
        setIsListening(true);
        toast({
          title: "Listening",
          description: "Speak your subscription details...",
        });
      } else {
        setIsListening(false);
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Error",
        description: "Could not access microphone. Please check your permissions.",
        variant: "destructive",
      });
      setIsListening(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-2">
      <Button
        type="button"
        variant={isListening ? "destructive" : "secondary"}
        onClick={handleVoiceInput}
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