export const speak = (text: string) => {
  console.log('Attempting to speak:', text);
  
  if (!window.speechSynthesis) {
    console.error('Speech synthesis not supported');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  utterance.onstart = () => {
    console.log('Started speaking:', text);
  };

  utterance.onend = () => {
    console.log('Finished speaking:', text);
  };

  utterance.onerror = (event) => {
    console.error('Speech synthesis error:', event);
  };

  window.speechSynthesis.speak(utterance);
};