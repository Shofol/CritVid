import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { AppProvider } from './contexts/AppContext';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/toaster';

// Initialize cron service with error boundary
try {
  import('./lib/cronService');
} catch (error) {
  console.error('Failed to load cron service:', error);
}

console.log('Main.tsx starting...');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="critvid-ui-theme">
        <AppProvider>
          <App />
          <Toaster />
        </AppProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

console.log('Main.tsx render complete');