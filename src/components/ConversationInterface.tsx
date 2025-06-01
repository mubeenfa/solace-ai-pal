
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Heart, Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'serene';
  timestamp: Date;
}

export const ConversationInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello, I'm Serene. I'm here to listen and support you. How are you feeling today? Take your time - there's no rush. 💙",
      sender: 'serene',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateSereneResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Stress-related responses
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxious') || lowerMessage.includes('worried')) {
      return "I hear that you're feeling stressed. That's completely understandable - life can feel overwhelming sometimes. Would you like to try a gentle breathing exercise with me? Just breathe in slowly for 4 counts, hold for 4, then breathe out for 6. You're safe here. 🌸";
    }
    
    // Sad or upset responses
    if (lowerMessage.includes('sad') || lowerMessage.includes('upset') || lowerMessage.includes('cry')) {
      return "I'm so sorry you're feeling this way. Your feelings are completely valid, and it's okay to not be okay sometimes. You don't have to go through this alone. Would you like to talk more about what's weighing on your heart? 💙";
    }
    
    // Angry or frustrated responses
    if (lowerMessage.includes('angry') || lowerMessage.includes('frustrated') || lowerMessage.includes('mad')) {
      return "I can sense your frustration, and that must be really difficult. Sometimes anger is our heart's way of protecting us. Take a moment to breathe with me. What would help you feel a little lighter right now? 🌿";
    }
    
    // Tired or exhausted responses
    if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted') || lowerMessage.includes('drain')) {
      return "It sounds like you're carrying a lot right now. Being tired isn't just about sleep - sometimes our hearts get tired too. You deserve rest and gentleness. What's one small thing that might bring you a moment of peace today? ✨";
    }
    
    // Positive responses
    if (lowerMessage.includes('good') || lowerMessage.includes('happy') || lowerMessage.includes('great')) {
      return "I'm so glad to hear you're feeling good! Those moments of lightness are precious. What's bringing you joy today? Remember to hold onto this feeling - you deserve all the happiness in the world. 🌻";
    }
    
    // Breathing exercise requests
    if (lowerMessage.includes('breath') || lowerMessage.includes('calm') || lowerMessage.includes('relax')) {
      return "Let's breathe together. Find a comfortable position and place one hand on your chest, one on your belly. Breathe in slowly through your nose for 4 counts... hold for 4... and breathe out through your mouth for 6. You're doing beautifully. Would you like to continue this for a few more breaths? 🌊";
    }
    
    // Default supportive responses
    const supportiveResponses = [
      "Thank you for sharing that with me. Your feelings matter, and I'm here to listen. What's on your mind right now? 💙",
      "I hear you, and I want you to know that whatever you're going through, you don't have to face it alone. Would you like to tell me more? 🌸",
      "That sounds important to you. I'm here to listen without judgment. Take your time - there's no pressure at all. ✨",
      "I'm grateful you felt comfortable sharing that with me. How are you taking care of yourself today? 🌿",
      "Your feelings are valid, and it's okay to take things one moment at a time. What would feel most supportive right now? 💙"
    ];
    
    return supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay for more natural conversation
    setTimeout(() => {
      const sereneResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateSereneResponse(inputText),
        sender: 'serene',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, sereneResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm shadow-xl border-0">
      {/* Messages Area */}
      <div className="h-96 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
              }`}
            >
              {message.sender === 'serene' && (
                <div className="flex items-center mb-2">
                  <Heart className="w-4 h-4 text-pink-400 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Serene</span>
                </div>
              )}
              <p className="text-sm leading-relaxed">{message.text}</p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex items-center">
                <Heart className="w-4 h-4 text-pink-400 mr-2" />
                <span className="text-sm font-medium text-gray-600 mr-3">Serene</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex space-x-3">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share what's on your mind... I'm here to listen 💙"
            className="flex-1 rounded-full border-gray-300 focus:border-blue-400 focus:ring-blue-400"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="rounded-full bg-blue-500 hover:bg-blue-600 text-white px-6"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
