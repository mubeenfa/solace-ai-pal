
import React, { useState } from 'react';
import { ConversationInterface } from '../components/ConversationInterface';
import { VoiceControls } from '../components/VoiceControls';
import { Heart, MessageCircle, Mic } from 'lucide-react';

const Index = () => {
  const [activeMode, setActiveMode] = useState<'text' | 'voice'>('text');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-pink-400 mr-2" />
            <h1 className="text-4xl font-bold text-gray-800">Serene</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your gentle AI companion for stress relief and emotional support. 
            Take a deep breath, and let's talk about how you're feeling today.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-1 shadow-md">
            <button
              onClick={() => setActiveMode('text')}
              className={`flex items-center px-6 py-3 rounded-full transition-all ${
                activeMode === 'text'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Text Chat
            </button>
            <button
              onClick={() => setActiveMode('voice')}
              className={`flex items-center px-6 py-3 rounded-full transition-all ${
                activeMode === 'voice'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-purple-500'
              }`}
            >
              <Mic className="w-5 h-5 mr-2" />
              Voice Chat
            </button>
          </div>
        </div>

        {/* Main Interface */}
        <div className="max-w-4xl mx-auto">
          {activeMode === 'text' ? (
            <ConversationInterface />
          ) : (
            <VoiceControls />
          )}
        </div>

        {/* Calming Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p className="text-sm">
            Remember: You are valued, you are enough, and it's okay to take things one moment at a time. 🌸
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
