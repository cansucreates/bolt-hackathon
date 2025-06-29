import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Load environment variables
const loadEnv = () => {
  // Check if Stripe key is available
  if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
    console.warn('Warning: VITE_STRIPE_PUBLISHABLE_KEY is not set. Stripe functionality will be limited to demo mode.');
  }
  
  // Check if Supabase keys are available
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.error('Error: Supabase environment variables are missing. Please check your .env file.');
  }
};

// Load environment variables
loadEnv();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);