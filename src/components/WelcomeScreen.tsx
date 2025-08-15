import React from 'react';
import { MessageCircle, Utensils, Clock, Users } from 'lucide-react';

interface WelcomeScreenProps {
  onStartChat: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartChat }) => {
  const examplePrompts = [
    "What can I make with chicken and rice?",
    "Give me a recipe for chocolate cake",
    "How do I make pasta from scratch?",
    "Quick dinner ideas for two people",
    "Vegetarian recipes under 30 minutes",
    "What's a good substitute for eggs in baking?"
  ];

  const features = [
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Natural Conversation",
      description: "Chat naturally about cooking, ingredients, and techniques"
    },
    {
      icon: <Utensils className="h-6 w-6" />,
      title: "Personalized Recipes",
      description: "Get recipes tailored to your preferences and dietary needs"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Quick Solutions",
      description: "Find fast answers to cooking questions and ingredient substitutions"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "All Skill Levels",
      description: "Whether you're a beginner or expert, get help at your level"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to
          <span className="text-orange-600 dark:text-orange-400"> Chef Byte</span>
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Your digital sous chef is ready to help! Get personalized recipes, smart cooking tips, and answers to all your culinary questions. Let's start cooking together.
        </p>

        <button
          onClick={onStartChat}
          className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Start Cooking Together
        </button>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div className="text-orange-600 dark:text-orange-400 mb-3">
              {feature.icon}
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Example Prompts */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
          Try asking me...
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {examplePrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => {
                onStartChat();
                // We'll implement auto-filling the prompt later
              }}
              className="text-left p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 group"
            >
              <span className="text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                "{prompt}"
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;