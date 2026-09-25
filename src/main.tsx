import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Element root tidak ditemukan pada DOM');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Registrasi Service Worker PWA Offline jika didukung oleh peramban
if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('EverLife Service Worker terdaftar dengan scope:', registration.scope);
      })
      .catch((error) => {
        console.warn('Registrasi Service Worker gagal:', error);
      });
  });
}
