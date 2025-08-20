import React from 'react';
import { Bot, User } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isRecipe?: boolean;
  recipeData?: any;
}

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.type === 'user';
  // This check ensures that AI messages identified as recipes do not render their 'content' here,
  // as the RecipeCard component is responsible for displaying the structured recipe data.
  const isRecipe = message.isRecipe && !isUser; 

  // If the message is an AI-generated recipe, this component returns null,
  // allowing the RecipeCard component (rendered separately in ChatInterface)
  // to display the recipe details.
  if (isRecipe) { 
    return null;
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-xs lg:max-w-2xl ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>
        {/* Avatar: Displays a user icon for user messages and a bot icon for AI messages. */}
        <div className={`flex-shrink-0 ${isUser ? 'ml-2' : 'mr-2'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser
              ? 'bg-orange-500 text-white' // Styling for user avatar
              : 'bg-emerald-600 text-white' // Styling for AI avatar
          }`}>
            {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </div>
        </div>

        {/* Message Content Bubble */}
        <div className={`px-4 py-2 rounded-lg ${
          isUser
            ? 'bg-orange-500 text-white rounded-br-sm' // Styling for user message bubble
            : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-bl-sm' // Styling for AI message bubble (with dark mode support)
        }`}>
          {/* Message text, preserving line breaks */}
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
          {/* Timestamp of the message */}
          <p className={`text-xs mt-1 ${
            isUser
              ? 'text-orange-100' // Darker text for user's timestamp
              : 'text-gray-500 dark:text-gray-400' // Lighter text for AI's timestamp (with dark mode support)
          }`}>
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
