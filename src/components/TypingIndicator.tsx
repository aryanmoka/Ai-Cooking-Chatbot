import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="flex max-w-xs lg:max-w-2xl items-start space-x-2">
        {/* Avatar for the bot */}
        <div className="flex-shrink-0 mr-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-600 text-white">
            <Bot className="h-4 w-4" />
          </div>
        </div>

        {/* Typing Animation (three bouncing dots) */}
        <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-4 py-3 rounded-lg rounded-bl-sm">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
