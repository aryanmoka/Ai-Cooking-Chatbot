import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  onShowContact: () => void; // Prop to show the contact page
}

const Header: React.FC<HeaderProps> = ({ onShowContact }) => { // Accept the onShowContact prop
  const { isDark, toggleTheme } = useTheme();

  return (
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

          {/* Right side: Navigation and Theme Toggle */}
          <div className="flex items-center space-x-6">
            {/* Navigation Links */}
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                <li>
                  <a href="#" onClick={() => window.location.reload()} className="text-white hover:text-orange-200 dark:hover:text-gray-300 transition-colors duration-200 font-medium">Home</a>
                </li>
                <li>
                  {/* FIX: Call onShowContact when the Contact link is clicked */}
                  <a href="#" onClick={onShowContact} className="text-white hover:text-orange-200 dark:hover:text-gray-300 transition-colors duration-200 font-medium">Contact</a>
                </li>
              </ul>
            </nav>

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
