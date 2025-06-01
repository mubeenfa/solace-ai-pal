
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Volume2, VolumeX, Heart } from 'lucide-react';

export const VoiceControls = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [volume, setVolume] = useState(0);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition && 'speechSynthesis' in window);

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
        
        if (event.results[current].isFinal) {
          handleVoiceInput(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthesisRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const generateSereneResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('stress') || input.includes('anxious') || input.includes('worried')) {
      return "I hear that you're feeling stressed. Let's take a moment together. Try breathing in slowly through your nose for four counts, hold for four, and breathe out through your mouth for six counts. You're doing great.";
    }
    
    if (input.includes('sad') || input.includes('down') || input.includes('upset')) {
      return "I'm really glad you shared that with me. It takes courage to express when we're hurting. Your feelings are completely valid, and you don't have to carry this alone. I'm here with you.";
    }
    
    if (input.includes('tired') || input.includes('exhausted')) {
      return "It sounds like you've been giving so much of yourself. Rest isn't selfish, it's necessary. You deserve to take care of yourself. Would you like to try a brief relaxation exercise?";
    }
    
    if (input.includes('better') || input.includes('good') || input.includes('happy')) {
      return "I'm so glad to hear that! It warms my heart when you're feeling good. You deserve all the happiness and peace. Thank you for sharing this brightness with me.";
    }
    
    const responses = [
      "Thank you for sharing with me. I'm here to listen and support you. Your feelings matter, and so do you.",
      "I hear you, and I want you to know that you're not alone. Whatever you're going through, I'm here to walk alongside you.",
      "You're safe here with me. Take all the time you need. I'm grateful you're here, and I'm here for you.",
      "Your courage in reaching out means so much. You're worthy of care and kindness. How can I best support you right now?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleVoiceInput = (transcript: string) => {
    if (!transcript.trim()) return;
    
    const aiResponse = generateSereneResponse(transcript);
    setResponse(aiResponse);
    speakResponse(aiResponse);
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel(); // Cancel any ongoing speech
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8; // Slower, more calming pace
      utterance.pitch = 1.1; // Slightly higher, warmer pitch
      utterance.volume = 0.8;
      
      // Try to use a gentle voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Female') || 
        voice.name.includes('Google') ||
        voice.name.includes('Samantha')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      synthesisRef.current = utterance;
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setResponse('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  if (!isSupported) {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center text-gray-600">
            <Heart className="w-6 h-6 text-pink-400 mr-2" />
            Voice Chat Unavailable
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">
            I'm sorry, but voice chat isn't supported in your browser. 
            You can still chat with me using the text mode! 💙
          </p>
          <p className="text-sm text-gray-500">
            Voice chat works best in Chrome, Safari, and Edge browsers.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center text-gray-700">
          <Heart className="w-6 h-6 text-pink-400 mr-2" />
          Voice Chat with Serene
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Speak naturally, and I'll listen with care and respond gently 🌸
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Voice Controls */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={isListening ? stopListening : startListening}
            disabled={isSpeaking}
            className={`px-8 py-4 rounded-full transition-all ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg scale-105' 
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5 mr-2" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 mr-2" />
                Start Speaking
              </>
            )}
          </Button>
          
          {isSpeaking && (
            <Button
              onClick={stopSpeaking}
              className="px-6 py-4 bg-gray-500 hover:bg-gray-600 text-white rounded-full"
            >
              <VolumeX className="w-5 h-5 mr-2" />
              Stop Speaking
            </Button>
          )}
        </div>

        {/* Status Indicators */}
        {isListening && (
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Listening...</span>
            </div>
          </div>
        )}

        {isSpeaking && (
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full">
              <Volume2 className="w-4 h-4" />
              <span className="text-sm font-medium">Serene is speaking...</span>
            </div>
          </div>
        )}

        {/* Transcript Display */}
        {transcript && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">You said:</p>
            <p className="text-gray-800">{transcript}</p>
          </div>
        )}

        {/* Response Display */}
        {response && (
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Heart className="w-4 h-4 text-pink-400 mr-2" />
              <p className="text-sm text-blue-600 font-medium">Serene responds:</p>
            </div>
            <p className="text-blue-800">{response}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="text-center text-sm text-gray-500 space-y-2">
          <p>💡 Tip: Click "Start Speaking" and share how you're feeling</p>
          <p>I'll listen carefully and respond with care and support</p>
        </div>
      </CardContent>
    </Card>
  );
};
