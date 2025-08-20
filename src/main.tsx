import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext'; // Import ThemeProvider

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Wrap your App component with ThemeProvider here */}
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
