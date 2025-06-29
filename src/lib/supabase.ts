import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are properly configured
if (!supabaseUrl || !supabaseAnonKey || 
    supabaseUrl === 'your_supabase_project_url_here' || 
    supabaseAnonKey === 'your_supabase_anon_key_here') {
  console.error('❌ Supabase configuration missing or using placeholder values');
  console.log('📝 To fix this:');
  console.log('1. Click "Connect to Supabase" in the top right corner');
  console.log('2. Or manually update your .env file with your Supabase credentials');
  console.log('3. Restart the development server');
  
  // Create a mock client to prevent the app from crashing
  throw new Error(`
    🔧 Supabase Configuration Required
    
    Your Supabase credentials are not configured. Please:
    
    1. Click the "Connect to Supabase" button in the top right corner, OR
    2. Manually update your .env file with:
       - VITE_SUPABASE_URL=https://your-project-id.supabase.co
       - VITE_SUPABASE_ANON_KEY=your-actual-anon-key
    
    3. Restart the development server after updating
  `);
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error(`Invalid Supabase URL format: ${supabaseUrl}. Expected format: https://your-project-id.supabase.co`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Types for our database
export interface UserProfile {
  id: string;
  email: string;
  user_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthError {
  message: string;
  status?: number;
}