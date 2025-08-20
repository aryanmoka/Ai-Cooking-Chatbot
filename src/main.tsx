// src/main.tsx 
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext'; // <<<--- IMPORTANT: This import is crucial

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* This ThemeProvider wrapper is CRITICAL for useTheme() to work */}
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);