import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import MessageBubble from './MessageBubble'; // Assumed path: src/components/MessageBubble.tsx
import RecipeCard from './RecipeCard';       // Assumed path: src/components/RecipeCard.tsx
import TypingIndicator from './TypingIndicator'; // Assumed path: src/components/TypingIndicator.tsx
import { chatAPI } from '../services/api'; // Assumed path: src/services/api.ts

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isRecipe?: boolean;
  recipeData?: any;
}

interface ChatInterfaceProps {
  sessionId: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ sessionId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scrolls to the bottom of the chat window whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Effect to scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Effect to focus on the input field when the component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handles sending a message to the AI
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return; // Prevent sending empty messages or multiple messages while loading

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]); // Add user message to chat
    setInputValue(''); // Clear input field
    setIsLoading(true); // Show loading indicator
    setError(null); // Clear any previous errors

    try {
      // Send message to backend API
      const response = await chatAPI.sendMessage(inputValue.trim(), sessionId);

      const aiMessage: Message = {
        id: `ai_${Date.now()}`,
        type: 'ai',
        content: response.response,
        timestamp: new Date(),
        isRecipe: response.is_recipe,
        recipeData: response.recipe_data
      };

      setMessages(prev => [...prev, aiMessage]); // Add AI response to chat
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.');
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  // Handles 'Enter' key press for sending messages
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Send on Enter, allow Shift+Enter for new line
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col bg-gray-100 dark:bg-gray-900 rounded-lg shadow-xl">
      {/* Messages Display Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-20">
            <p className="text-lg">Start a conversation about cooking!</p>
            <p className="text-sm mt-2">Ask me for recipes, cooking tips, or ingredient substitutions.</p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id}>
            <MessageBubble message={message} />
            {/* If the message is an AI recipe, render the RecipeCard */}
            {message.isRecipe && message.recipeData && (
              <div className="mt-4">
                <RecipeCard
                  recipe={message.recipeData}
                  sessionId={sessionId}
                />
              </div>
            )}
          </div>
        ))}

        {isLoading && <TypingIndicator />} {/* Show typing indicator when loading */}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} /> {/* Reference for scrolling to bottom */}
      </div>

      {/* Message Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about cooking, recipes, or ingredients..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" /> // Loader icon when loading
            ) : (
              <Send className="h-5 w-5" /> // Send icon
            )}
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
