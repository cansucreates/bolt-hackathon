import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError as SupabaseAuthError } from '@supabase/supabase-js';
import { supabase, UserProfile, AuthError } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: { user_name?: string }) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await fetchUserProfile(session.user.id);
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        // Only set loading to false after we've processed the auth change
        if (event !== 'INITIAL_SESSION') {
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const signUp = async (email: string, password: string, userData?: { user_name?: string }) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData || {}
        }
      });

      if (error) {
        return { error: { message: error.message, status: 400 } };
      }

      return { error: null };
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
          status: 500 
        } 
      };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { error: { message: error.message, status: 400 } };
      }

      return { error: null };
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
          status: 500 
        } 
      };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      
      // Get the current origin for the redirect URL
      const redirectTo = `${window.location.origin}/auth/callback`;
      
      console.log('Initiating Google OAuth with redirect to:', redirectTo);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            prompt: 'select_account'
          }
        }
      });

      if (error) {
        console.error('Google sign-in error:', error);
        setLoading(false);
        return { error: { message: error.message, status: 400 } };
      }

      // Note: For OAuth, the actual authentication happens via redirect
      // so we don't set loading to false here - it will be handled by the callback
      console.log('Google OAuth initiated successfully');
      return { error: null };
    } catch (error) {
      setLoading(false);
      console.error('Unexpected Google sign-in error:', error);
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
          status: 500 
        } 
      };
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { error: { message: error.message, status: 400 } };
      }

      setUser(null);
      setProfile(null);
      setSession(null);
      
      return { error: null };
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
          status: 500 
        } 
      };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) {
        return { error: { message: 'No user logged in', status: 401 } };
      }

      setLoading(true);

      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return { error: { message: error.message, status: 400 } };
      }

      setProfile(data);
      return { error: null };
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
          status: 500 
        } 
      };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) {
        return { error: { message: error.message, status: 400 } };
      }

      return { error: null };
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
          status: 500 
        } 
      };
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};