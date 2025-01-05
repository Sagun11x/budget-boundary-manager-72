interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  error: string;  // Added this line to fix the TypeScript error
}

interface Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}