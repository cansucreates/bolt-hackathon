// Authentication debugging utilities
export const logAuthState = (context: string, data: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[AUTH DEBUG] ${context}:`, data);
  }
};

export const logAuthError = (context: string, error: any) => {
  console.error(`[AUTH ERROR] ${context}:`, error);
};

export const checkEnvironmentVariables = () => {
  const requiredVars = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY
  };

  const missing = Object.entries(requiredVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.error('[AUTH ERROR] Missing environment variables:', missing);
    return false;
  }

  console.log('[AUTH DEBUG] Environment variables check passed');
  return true;
};

export const testSupabaseConnection = async () => {
  try {
    const { supabase } = await import('../lib/supabase');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('[AUTH ERROR] Supabase connection test failed:', error);
      return false;
    }
    
    console.log('[AUTH DEBUG] Supabase connection test passed');
    return true;
  } catch (error) {
    console.error('[AUTH ERROR] Supabase connection test exception:', error);
    return false;
  }
};

export const diagnoseAuthIssues = async () => {
  console.log('[AUTH DEBUG] Running authentication diagnostics...');
  
  const results = {
    environmentVariables: checkEnvironmentVariables(),
    supabaseConnection: await testSupabaseConnection(),
    browserSupport: {
      localStorage: typeof Storage !== 'undefined',
      sessionStorage: typeof sessionStorage !== 'undefined',
      fetch: typeof fetch !== 'undefined'
    }
  };
  
  console.log('[AUTH DEBUG] Diagnostic results:', results);
  return results;
};