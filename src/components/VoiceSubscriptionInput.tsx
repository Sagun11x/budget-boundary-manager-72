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
  const { toast } = useToast();

  const processVoiceInput = async (text: string) => {
    try {
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
        const periodParts = data.period.split(' ');
        const number = periodParts[0];
        let unit = periodParts[1].toLowerCase();
        
        // Convert unit to plural if it's not already
        if (!unit.endsWith('s')) {
          unit += 's';
        }

        onSubscriptionData({
          name: data.name,
          cost: data.cost,
          renewalNumber: number,
          renewalUnit: unit as "days" | "weeks" | "months" | "years",
        });

        toast({
          title: "Success",
          description: "Voice input processed successfully!",
        });
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        toast({
          title: "Error",
          description: "Could not understand the subscription details. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error processing voice input:', error);
      toast({
        title: "Error",
        description: "There was an error processing your voice input. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleVoiceInput = async () => {
    try {
      if (!isListening) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
          throw new Error('Speech recognition not supported');
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          processVoiceInput(transcript);
        };

        recognition.onerror = (event) => {
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