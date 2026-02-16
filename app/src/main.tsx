import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { seedDatabase } from '@/db/seed';
import './index.css';

seedDatabase();

if ('storage' in navigator && 'persist' in navigator.storage) {
  navigator.storage.persist();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
