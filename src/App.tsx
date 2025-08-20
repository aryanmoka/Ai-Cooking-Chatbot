import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import WelcomeScreen from './components/WelcomeScreen';
import Header from './components/Header';
import Footer from './components/Footer';
import Contact from './components/Contact'; // Ensure this import is correct and file is Contact.tsx
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [showContactPage, setShowContactPage] = useState(false); // Crucial state for contact page

  useEffect(() => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
  }, []);




  console.log ("running");
  const handleStartChat = () => {
    setHasStartedChat(true);
    setShowContactPage(false); // Hide contact page if starting chat
  };

  // This function is passed to Header and sets state to show Contact page
  const handleShowContact = () => {
    setShowContactPage(true);
    setHasStartedChat(false); // Hide chat/welcome when contact page is shown
  };

  const handleGoBackToChat = () => {
    setShowContactPage(false);
    setHasStartedChat(true); // Return to the chat interface
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-orange-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
        {/* Pass the handleShowContact function to the Header */}
        <Header onShowContact={handleShowContact} />
        <main className="container mx-auto px-4 flex-grow">
          {/* Conditional rendering based on state */}
          {!hasStartedChat && !showContactPage ? (
            <WelcomeScreen onStartChat={handleStartChat} />
          ) : showContactPage ? (
            <Contact onGoBack={handleGoBackToChat} /> // Render Contact component when showContactPage is true
          ) : (
            <ChatInterface sessionId={sessionId} />
          )}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
