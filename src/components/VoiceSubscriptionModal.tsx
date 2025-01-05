import { useState, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

  useEffect(() => {
    if (open) {
      speak("Please describe your subscription");
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
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join("");
        setTranscript(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      setRecognition(recognition);
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      handleSubmit();
    } else {
      setTranscript("");
      recognition.start();
      setIsListening(true);
    }
  };

  const handleSubmit = async () => {
    if (!transcript) return;

    try {
      const subscriptionData = await processVoiceInput(transcript);
      await onSave(subscriptionData);
      speak("Subscription added successfully");
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving subscription:', error);
      speak("Sorry, I couldn't process that. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Subscription by Voice</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center">
            <Button
              onClick={toggleListening}
              variant={isListening ? "destructive" : "default"}
              size="lg"
              className="rounded-full p-6"
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
        </div>
      </DialogContent>
    </Dialog>
  );
};