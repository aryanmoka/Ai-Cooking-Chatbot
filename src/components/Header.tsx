import React from 'react';
import { Moon, Sun } from 'lucide-react';
// >>> IMPORTANT: Verify this path matches your actual file structure <<<
import { useTheme } from '../contexts/ThemeContext'; 

// HeaderProps no longer needs onShowContact, as navigation is handled by App component
interface HeaderProps {
  // If you want to keep the header fixed at the top and avoid content overlapping,
  // this component doesn't need props for navigation directly.
  // The main App component will render the fixed header.
}

const Header: React.FC<HeaderProps> = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    // This header styling is now integrated directly into the App.tsx's fixed header.
    // This component will be removed or refactored if the App component's header is used.
    // For now, assuming this is a standalone header that will be replaced.
    <header className="bg-orange-600 dark:bg-gray-800 shadow-lg transition-colors duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side: Title only */}
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white">
              Chef Byte
            </h1>
            <span className="text-sm text-orange-200 dark:text-gray-400 hidden sm:inline">
              Your Digital Sous Chef
            </span>
          </div>

          {/* Right side: Theme Toggle only */}
          <div className="flex items-center space-x-6">
            {/* Navigation Links are removed from here, as they are handled by the App component's main header */}
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-orange-700 dark:bg-gray-700 hover:bg-orange-800 dark:hover:bg-gray-600 transition-colors duration-200 text-white"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-yellow-300" />
              ) : (
                <Moon className="h-5 w-5 text-orange-200" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
