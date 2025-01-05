import { useState, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { speak, processVoiceInput } from "@/utils/speechUtils";
import type { Subscription } from "@/types/subscription";

interface VoiceSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (subscription: Subscription) => Promise<void>;
}

export const VoiceSubscriptionModal = ({
  open,
  onOpenChange,
  onSave,
}: VoiceSubscriptionModalProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (open) {
      speak("Please describe your subscription. For example, say: add Netflix for 30 days at 12 dollars");
    }
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [open]);

  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false; // Changed to false to ensure we get one complete utterance
      recognition.interimResults = false; // Changed to false to get only final results

      recognition.onresult = (event) => {
        const finalTranscript = event.results[0][0].transcript;
        setTranscript(finalTranscript);
        handleSubmit(finalTranscript); // Automatically process when we get the final result
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        speak("Sorry, there was an error with speech recognition. Please try again.");
      };

      setRecognition(recognition);
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      recognition.start();
      setIsListening(true);
      speak("I'm listening");
    }
  };

  const handleSubmit = async (transcriptText: string) => {
    if (!transcriptText || isProcessing) return;

    try {
      setIsProcessing(true);
      const subscriptionData = await processVoiceInput(transcriptText);
      await onSave(subscriptionData);
      speak("Subscription added successfully");
      setTranscript("");
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving subscription:', error);
      speak("Sorry, I couldn't process that. Please try again.");
    } finally {
      setIsProcessing(false);
      setIsListening(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Subscription by Voice</DialogTitle>
          <DialogDescription>
            Click the microphone and describe your subscription.
            For example: "add Netflix for 30 days at 12 dollars"
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center">
            <Button
              onClick={toggleListening}
              variant={isListening ? "destructive" : "default"}
              size="lg"
              className="rounded-full p-6"
              disabled={isProcessing}
            >
              {isListening ? (
                <MicOff className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </Button>
          </div>
          {transcript && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">{transcript}</p>
            </div>
          )}
          {isProcessing && (
            <div className="text-center text-sm text-muted-foreground">
              Processing your request...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};