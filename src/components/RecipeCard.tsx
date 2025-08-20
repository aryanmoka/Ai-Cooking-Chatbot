import React, { useState } from 'react';
import { Clock, Users, Copy, Check, Bookmark, BookmarkCheck, Loader2 } from 'lucide-react'; // Added Loader2 import
import { chatAPI } from '../services/api'; // This path assumes api.ts is in src/services/ and RecipeCard.tsx is in src/components/

interface Recipe {
  title: string;
  description?: string;
  ingredients: string[];
  instructions: string[];
  prep_time?: string;
  cook_time?: string;
  servings?: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  sessionId: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, sessionId }) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Function to copy ingredients to the clipboard
  const copyIngredients = async () => {
    // Join ingredients with newline characters for easy pasting
    const ingredientsList = recipe.ingredients.join('\n');
    try {
      // Use navigator.clipboard.writeText to copy text
      await navigator.clipboard.writeText(ingredientsList);
      setCopied(true); // Set copied state to true
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy ingredients:', err);
      // In a production app, you might show a user-friendly error message here
    }
  };

  // Function to save the recipe via the API
  const saveRecipe = async () => {
    setSaving(true); // Indicate saving process has started
    try {
      // Call the chatAPI to save the recipe, associating it with the current session
      await chatAPI.saveRecipe(sessionId, recipe);
      setSaved(true); // Set saved state to true on success
    } catch (err) {
      console.error('Failed to save recipe:', err);
      // In a production app, you might show a user-friendly error message here
    } finally {
      setSaving(false); // Reset saving state
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header section of the recipe card */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">{recipe.title}</h3>
            {recipe.description && (
              <p className="text-orange-100 text-sm">{recipe.description}</p>
            )}
          </div>
          {/* Save Recipe Button */}
          <button
            onClick={saveRecipe}
            disabled={saving || saved} // Disable if saving or already saved
            className="ml-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
            aria-label={saved ? "Recipe saved" : "Save recipe"}
          >
            {saving ? ( // Show a loader or different icon if saving
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : saved ? ( // Show checkmark if saved
              <BookmarkCheck className="h-5 w-5" />
            ) : ( // Show bookmark if not saved
              <Bookmark className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Recipe Meta (Prep Time, Cook Time, Servings) */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          {recipe.prep_time && (
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>Prep: {recipe.prep_time}</span>
            </div>
          )}
          {recipe.cook_time && (
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>Cook: {recipe.cook_time}</span>
            </div>
          )}
          {recipe.servings && (
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>Serves: {recipe.servings}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Ingredients Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Ingredients
            </h4>
            {/* Copy Ingredients Button */}
            <button
              onClick={copyIngredients}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors duration-200"
              aria-label={copied ? "Ingredients copied" : "Copy ingredients"}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li
                key={index}
                className="flex items-start space-x-2 text-gray-700 dark:text-gray-300"
              >
                <span className="text-orange-500 mt-1">•</span>
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions Section */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Instructions
          </h4>
          <ol className="space-y-3">
            {recipe.instructions.map((instruction, index) => (
              <li
                key={index}
                className="flex items-start space-x-3 text-gray-700 dark:text-gray-300"
              >
                <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white text-sm font-medium rounded-full flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="leading-relaxed">{instruction}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
