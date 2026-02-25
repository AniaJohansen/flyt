import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { seedDatabase } from '@/db/seed';
import './index.css';

seedDatabase();

// Request persistent storage so the browser won't evict IndexedDB data
if ('storage' in navigator && 'persist' in navigator.storage) {
  navigator.storage.persist().then((granted) => {
    localStorage.setItem('flyt_storage_persistent', granted ? '1' : '0');
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
