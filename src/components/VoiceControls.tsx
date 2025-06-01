
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Volume2, VolumeX, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const VoiceControls = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const speechSynthesis = window.speechSynthesis;
    
    if (SpeechRecognition && speechSynthesis) {
      setIsSupported(true);
      synthRef.current = speechSynthesis;
      
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscript(finalTranscript);
          handleVoiceInput(finalTranscript);
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "There was an issue with voice recognition. Please try again.",
          variant: "destructive"
        });
      };
      
      recognitionRef.current = recognition;
    } else {
      toast({
        title: "Voice Features Unavailable",
        description: "Your browser doesn't support voice features. Please use text chat instead.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const generateSereneVoiceResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('stress') || lowerInput.includes('anxious')) {
      return "I hear that you're feeling stressed. Let's take a moment together. Breathe in slowly with me... and breathe out. You're safe here, and this feeling will pass.";
    }
    
    if (lowerInput.includes('sad') || lowerInput.includes('upset')) {
      return "I'm so sorry you're feeling this way. Your feelings are completely valid. Remember, you don't have to carry this alone. I'm here with you.";
    }
    
    if (lowerInput.includes('calm') || lowerInput.includes('relax')) {
      return "Let's find some calm together. Close your eyes if you feel comfortable. Imagine a peaceful place where you feel completely safe and at ease. Breathe gently.";
    }
    
    return "Thank you for sharing that with me. Your voice matters, and I'm here to listen. Whatever you're feeling right now is okay.";
  };

  const handleVoiceInput = (input: string) => {
    setTranscript(input);
    const response = generateSereneVoiceResponse(input);
    speakText(response);
  };

  const speakText = (text: string) => {
    if (!synthRef.current || isSpeaking) return;
    
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Use a gentle, calm voice
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    utterance.volume = 0.9;
    
    // Try to use a female voice for a more nurturing feel
    const voices = synthRef.current.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('samantha') ||
      voice.name.toLowerCase().includes('alex')
    );
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
      toast({
        title: "Speech Error",
        description: "There was an issue with text-to-speech. Please try again.",
        variant: "destructive"
      });
    };
    
    synthRef.current.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const startCalming = () => {
    const calmingText = "Let's take a moment for a calming breathing exercise. Find a comfortable position. Now, breathe in slowly through your nose for four counts... one, two, three, four. Hold your breath gently for four counts... one, two, three, four. Now breathe out slowly through your mouth for six counts... one, two, three, four, five, six. You're doing beautifully. Let's do this two more times together.";
    speakText(calmingText);
  };

  if (!isSupported) {
    return (
      <Card className="w-full max-w-2xl mx-auto p-8 text-center bg-white/80 backdrop-blur-sm">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Voice Chat Unavailable</h3>
        <p className="text-gray-600 mb-4">
          Your browser doesn't support voice features. Please switch to text chat to continue our conversation.
        </p>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto p-8 bg-white/80 backdrop-blur-sm shadow-xl border-0">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Heart className="w-6 h-6 text-pink-400 mr-2" />
          <h3 className="text-2xl font-semibold text-gray-800">Voice Chat with Serene</h3>
        </div>
        <p className="text-gray-600">
          Speak naturally, and I'll listen with care. Take your time - there's no rush.
        </p>
      </div>

      {/* Voice Controls */}
      <div className="flex flex-col items-center space-y-6">
        {/* Main Voice Button */}
        <div className="relative">
          <Button
            onClick={toggleListening}
            disabled={isSpeaking}
            className={`w-24 h-24 rounded-full transition-all duration-300 ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-purple-500 hover:bg-purple-600'
            }`}
          >
            {isListening ? (
              <MicOff className="w-8 h-8 text-white" />
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </Button>
          
          {isListening && (
            <div className="absolute -inset-4 rounded-full border-4 border-purple-300 animate-ping"></div>
          )}
        </div>

        <p className="text-sm text-gray-600 text-center">
          {isListening ? 'Listening... Tap to stop' : 'Tap to start speaking'}
        </p>

        {/* Speaking Indicator */}
        {isSpeaking && (
          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-full">
            <Volume2 className="w-5 h-5 text-blue-500" />
            <span className="text-blue-700 font-medium">Serene is speaking...</span>
            <Button
              onClick={stopSpeaking}
              variant="outline"
              size="sm"
              className="ml-2"
            >
              <VolumeX className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Transcript Display */}
        {transcript && (
          <div className="w-full p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">You said:</p>
            <p className="text-gray-800">{transcript}</p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            onClick={startCalming}
            disabled={isSpeaking}
            variant="outline"
            className="text-green-600 border-green-300 hover:bg-green-50"
          >
            Guided Breathing
          </Button>
          <Button
            onClick={() => speakText("You are enough, exactly as you are. This moment is temporary, and you have the strength to get through it. I believe in you.")}
            disabled={isSpeaking}
            variant="outline"
            className="text-blue-600 border-blue-300 hover:bg-blue-50"
          >
            Affirmation
          </Button>
        </div>
      </div>
    </Card>
  );
};
