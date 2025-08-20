import React, { useState, useEffect } from 'react';
// Import Moon and Sun icons from lucide-react
import { Moon, Sun } from 'lucide-react'; 

// These import paths are correct IF:
// - Your App.tsx is directly in the 'src/' folder.
// - Your ChatInterface, WelcomeScreen, Footer, and Contact components are in 'src/components/'.
import ChatInterface from './components/ChatInterface';
import WelcomeScreen from './components/WelcomeScreen';
import Footer from './components/Footer';
import Contact from './components/Contact';
// This import path is correct IF:
// - Your ThemeContext.tsx is in 'src/contexts/'.
import { useTheme } from './contexts/ThemeContext'; 
// Note: ThemeProvider is imported here but should wrap App in main.tsx/index.tsx
// import { ThemeProvider } from './contexts/ThemeContext'; // This line is not needed here if ThemeProvider wraps App externally

function App() {
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [showContactPage, setShowContactPage] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  // Access theme context directly in App
  const { isDark, toggleTheme } = useTheme(); 

  // Initialize session ID on component mount
  useEffect(() => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
  }, []);

  // Centralized navigation function
  const navigateTo = (view: 'home' | 'chatbot' | 'contact') => {
    if (view === 'home') {
      setHasStartedChat(false);
      setShowContactPage(false);
    } else if (view === 'chatbot') {
      setHasStartedChat(true);
      setShowContactPage(false);
    } else if (view === 'contact') {
      // Corrected logic for navigating to contact page
      setHasStartedChat(false); // Hide chat/welcome when contact page is shown
      setShowContactPage(true); // Show contact page
    }
    setIsMobileMenuOpen(false); // Always close mobile menu on navigation
  };

  // Helper for "Go Back to Home" in mobile menu
  const handleGoBackToHome = () => navigateTo('home');

  return (
    // The ThemeProvider is now expected to wrap this App component in your main.tsx/index.tsx file.
    <div className="min-h-screen bg-orange-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col font-inter">
      {/* Integrated Header with responsive navigation and theme toggle */}
      <header className="fixed w-full bg-white dark:bg-gray-800 shadow-md z-50 p-4 flex justify-between items-center rounded-b-xl">
        <div className="text-2xl font-bold text-indigo-600 dark:text-orange-400">
          CookBot
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <button
            onClick={() => navigateTo('home')}
            className={`text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-orange-400 transition duration-300 font-medium py-2 px-3 rounded-md hover:bg-indigo-50 dark:hover:bg-gray-700
              ${!hasStartedChat && !showContactPage ? 'text-indigo-600 dark:text-orange-400 font-bold' : ''}`}
          >
            Home
          </button>
          <button
            onClick={() => navigateTo('contact')}
            className={`text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-orange-400 transition duration-300 font-medium py-2 px-3 rounded-md hover:bg-indigo-50 dark:hover:bg-gray-700
              ${showContactPage ? 'text-indigo-600 dark:text-orange-400 font-bold' : ''}`}
          >
            Contact
          </button>
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

        {/* Mobile Menu Button (Hamburger) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-orange-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 p-2 rounded-md"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        } md:hidden`}
        onClick={() => setIsMobileMenuOpen(false)} // Close menu when clicking outside
      ></div>

      {/* Mobile Menu Sidebar */}
      <nav
        className={`fixed top-0 right-0 w-64 h-full bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-orange-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 p-2 rounded-md"
            aria-label="Close navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <ul className="flex flex-col space-y-4 p-4 mt-8">
          <li>
            <button
              onClick={() => navigateTo('home')}
              className={`w-full text-left text-gray-800 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-orange-400 py-3 px-4 rounded-md transition duration-300 font-medium text-lg
                ${!hasStartedChat && !showContactPage ? 'text-indigo-600 dark:text-orange-400 font-bold' : ''}`}
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => navigateTo('contact')}
              className={`w-full text-left text-gray-800 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-orange-400 py-3 px-4 rounded-md transition duration-300 font-medium text-lg
                ${showContactPage ? 'text-indigo-600 dark:text-orange-400 font-bold' : ''}`}
            >
              Contact
            </button>
          </li>
          <li>
            {/* Go Back to Home button in mobile menu */}
            <button
              onClick={handleGoBackToHome}
              className="w-full text-left text-gray-800 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-orange-400 py-3 px-4 rounded-md transition duration-300 font-medium text-lg"
            >
              Go Back to Home
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content Area */}
      <main className="pt-16 md:pt-20 flex-grow"> {/* Adjusted padding-top for fixed header */}
        {!hasStartedChat && !showContactPage ? (
          <WelcomeScreen onStartChat={() => navigateTo('chatbot')} />
        ) : showContactPage ? (
          <Contact onGoBack={() => navigateTo('chatbot')} />
        ) : (
          <ChatInterface sessionId={sessionId} />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
