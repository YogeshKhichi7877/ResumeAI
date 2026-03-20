import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import './index.css';

// ── Register Service Worker ───────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        setInterval(() => reg.update(), 60 * 1000);
        reg.addEventListener('updatefound', () => {
          const nw = reg.installing;
          nw?.addEventListener('statechange', () => {
            if (nw.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available — optionally show a "refresh" toast here
            }
          });
        });
      })
      .catch((err) => console.error('❌ SW failed:', err));
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#000',
              color: '#fff',
              border: '3px solid #FFE566',
              boxShadow: '4px 4px 0px #FFE566',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </ErrorBoundary>
);