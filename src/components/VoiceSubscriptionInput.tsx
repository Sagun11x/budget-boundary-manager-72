import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, StopCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Subscription } from "@/types/subscription";

interface VoiceSubscriptionInputProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (subscription: Omit<Subscription, "id" | "userId">) => void;
}

export function VoiceSubscriptionInput({ open, onOpenChange, onSave }: VoiceSubscriptionInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const { toast } = useToast();
  const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();

  useEffect(() => {
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      setTranscript(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event);
      toast({
        title: "Error",
        description: "There was an error with speech recognition",
        variant: "destructive",
      });
      setIsListening(false);
    };

    return () => {
      recognition.stop();
    };
  }, []);

  const startListening = () => {
    setTranscript("");
    setIsListening(true);
    recognition.start();
  };

  const stopListening = async () => {
    setIsListening(false);
    recognition.stop();
    
    if (transcript) {
      try {
        const subscription = await processVoiceInput(transcript);
        if (subscription) {
          onSave(subscription);
          onOpenChange(false);
          toast({
            title: "Success",
            description: "Subscription added successfully",
          });
          speak("Subscription added successfully");
        }
      } catch (error) {
        console.error("Error processing voice input:", error);
        toast({
          title: "Error",
          description: "Could not process voice input",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Subscription by Voice</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={isListening ? stopListening : startListening}
              variant={isListening ? "destructive" : "default"}
              className="w-full"
            >
              {isListening ? (
                <>
                  <StopCircle className="mr-2 h-4 w-4" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" />
                  Start Recording
                </>
              )}
            </Button>
            {transcript && (
              <div className="w-full p-4 bg-gray-100 rounded-md">
                <p className="text-sm">{transcript}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}