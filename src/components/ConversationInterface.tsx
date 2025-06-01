
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Heart } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const ConversationInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello there! I'm Serene, your gentle AI companion. I'm here to listen and support you. How are you feeling today? 🌸",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateSereneResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Stress and anxiety responses
    if (message.includes('stress') || message.includes('anxious') || message.includes('overwhelmed')) {
      const responses = [
        "I hear that you're feeling stressed right now. That sounds really difficult. Let's take a moment together - would you like to try a simple breathing exercise with me?",
        "It sounds like you're carrying a lot right now. You're brave for reaching out. Sometimes when we're overwhelmed, taking things one breath at a time can help. 💙",
        "I'm sorry you're feeling this way. Stress can feel so heavy. You're not alone in this. Would it help to talk about what's weighing on your mind?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Sad or down responses
    if (message.includes('sad') || message.includes('down') || message.includes('depressed') || message.includes('lonely')) {
      const responses = [
        "I'm really glad you shared that with me. It takes courage to express when we're hurting. Your feelings are completely valid. 🤗",
        "I hear you, and I want you to know that it's okay to feel sad sometimes. You don't have to carry this alone. I'm here with you.",
        "Thank you for trusting me with how you're feeling. Even in dark moments, you matter so much. Would you like to talk more about what's making you feel this way?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Tired or exhausted
    if (message.includes('tired') || message.includes('exhausted') || message.includes('drained')) {
      const responses = [
        "It sounds like you've been giving so much of yourself. Rest isn't selfish - it's necessary. You deserve to take care of yourself. 🌙",
        "Being tired can make everything feel harder. You're doing your best, and that's enough. Would a few minutes of gentle breathing help you feel a bit more centered?",
        "I hear how depleted you're feeling. Sometimes our bodies and minds are asking us to slow down. You have permission to rest. 💚"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Breathing or calm requests
    if (message.includes('breath') || message.includes('calm') || message.includes('relax')) {
      return "Let's breathe together. Find a comfortable position and follow along: Breathe in slowly for 4 counts... hold for 4... and breathe out for 6. You're doing beautifully. 🌸";
    }
    
    // Positive responses
    if (message.includes('good') || message.includes('better') || message.includes('happy') || message.includes('great')) {
      const responses = [
        "I'm so glad to hear that! It warms my heart when you're feeling good. You deserve all the happiness and peace. ✨",
        "That's wonderful! It's beautiful to see you in a good space. Thank you for sharing this brightness with me. 😊",
        "Your positive energy is lovely to witness. I hope this feeling stays with you and grows even stronger. 🌻"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Default gentle responses
    const defaultResponses = [
      "Thank you for sharing with me. I'm here to listen. Would you like to tell me more about how you're feeling?",
      "I hear you. Sometimes it helps just to have someone listen. I'm here for you, no matter what you're going through. 💙",
      "Your feelings matter, and so do you. Take all the time you need. I'm here to support you in whatever way feels right.",
      "I'm grateful you're here with me. Would you like to try a gentle breathing exercise, or would you prefer to keep talking?",
      "You're safe here. Whatever you're experiencing is valid. I'm here to walk alongside you through whatever you're facing. 🌸"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateSereneResponse(inputValue),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardContent className="p-0">
        {/* Messages Container */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.isUser
                    ? 'bg-blue-500 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}
              >
                {!message.isUser && (
                  <div className="flex items-center mb-2">
                    <Heart className="w-4 h-4 text-pink-400 mr-2" />
                    <span className="text-xs font-medium text-gray-600">Serene</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 max-w-xs">
                <div className="flex items-center mb-2">
                  <Heart className="w-4 h-4 text-pink-400 mr-2" />
                  <span className="text-xs font-medium text-gray-600">Serene</span>
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t bg-gray-50/80 p-4">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what's on your mind... I'm here to listen 💙"
              className="flex-1 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send • Take your time, there's no rush 🌸
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
