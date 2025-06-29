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
    // Get initial session with timeout
    const getInitialSession = async () => {
      try {
        console.log('AuthContext: Getting initial session...');
        setLoading(true);
        
        // Add timeout to prevent hanging
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session fetch timeout')), 10000)
        );
        
        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;
        
        if (error) {
          console.error('AuthContext: Error getting session:', error);
          // Clear any stale auth state
          setSession(null);
          setUser(null);
          setProfile(null);
        } else {
          console.log('AuthContext: Initial session:', session ? 'Found' : 'None');
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await fetchUserProfile(session.user.id);
          } else {
            setProfile(null);
          }
        }
      } catch (error) {
        console.error('AuthContext: Error in getInitialSession:', error);
        // Clear auth state on error
        setSession(null);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes with improved error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthContext: Auth state changed:', event, session?.user?.email || 'No user');
        
        try {
          // Handle different auth events
          switch (event) {
            case 'SIGNED_IN':
              console.log('AuthContext: User signed in');
              setSession(session);
              setUser(session?.user ?? null);
              if (session?.user) {
                await fetchUserProfile(session.user.id);
              }
              break;
              
            case 'SIGNED_OUT':
              console.log('AuthContext: User signed out');
              setSession(null);
              setUser(null);
              setProfile(null);
              break;
              
            case 'TOKEN_REFRESHED':
              console.log('AuthContext: Token refreshed');
              setSession(session);
              setUser(session?.user ?? null);
              break;
              
            case 'USER_UPDATED':
              console.log('AuthContext: User updated');
              setSession(session);
              setUser(session?.user ?? null);
              if (session?.user) {
                await fetchUserProfile(session.user.id);
              }
              break;
              
            default:
              // For any other events, update the session state
              setSession(session);
              setUser(session?.user ?? null);
              if (session?.user) {
                await fetchUserProfile(session.user.id);
              } else {
                setProfile(null);
              }
          }
        } catch (error) {
          console.error('AuthContext: Error handling auth state change:', error);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('AuthContext: Fetching user profile for:', userId);
      
      const profilePromise = supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
        
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000)
      );

      const { data, error } = await Promise.race([
        profilePromise,
        timeoutPromise
      ]) as any;

      if (error) {
        console.error('AuthContext: Error fetching user profile:', error);
        // Don't set profile to null here, as the user might still be valid
        return;
      }

      console.log('AuthContext: User profile fetched:', data);
      setProfile(data);
    } catch (error) {
      console.error('AuthContext: Error fetching user profile:', error);
    }
  };

  const signUp = async (email: string, password: string, userData?: { user_name?: string }) => {
    try {
      console.log('AuthContext: Starting sign up for:', email);
      setLoading(true);
      
      const signUpPromise = supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData || {}
        }
      });
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sign up timeout')), 30000)
      );

      const { data, error } = await Promise.race([
        signUpPromise,
        timeoutPromise
      ]) as any;

      if (error) {
        console.error('AuthContext: Sign up error:', error);
        return { error: { message: error.message, status: 400 } };
      }

      console.log('AuthContext: Sign up successful');
      return { error: null };
    } catch (error) {
      console.error('AuthContext: Sign up exception:', error);
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
      console.log('AuthContext: Starting sign in for:', email);
      setLoading(true);
      
      const signInPromise = supabase.auth.signInWithPassword({
        email,
        password
      });
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sign in timeout')), 30000)
      );

      const { data, error } = await Promise.race([
        signInPromise,
        timeoutPromise
      ]) as any;

      if (error) {
        console.error('AuthContext: Sign in error:', error);
        return { error: { message: error.message, status: 400 } };
      }

      console.log('AuthContext: Sign in successful');
      return { error: null };
    } catch (error) {
      console.error('AuthContext: Sign in exception:', error);
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
      console.log('AuthContext: Starting Google sign in');
      setLoading(true);
      
      // Get the current origin for the redirect URL
      const redirectTo = `${window.location.origin}/auth/callback`;
      
      console.log('AuthContext: Initiating Google OAuth with redirect to:', redirectTo);
      
      const googleSignInPromise = supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Google sign in timeout')), 30000)
      );

      const { data, error } = await Promise.race([
        googleSignInPromise,
        timeoutPromise
      ]) as any;

      if (error) {
        console.error('AuthContext: Google sign-in error:', error);
        setLoading(false);
        return { error: { message: error.message, status: 400 } };
      }

      // Note: For OAuth, the actual authentication happens via redirect
      // so we don't set loading to false here - it will be handled by the callback
      console.log('AuthContext: Google OAuth initiated successfully');
      return { error: null };
    } catch (error) {
      setLoading(false);
      console.error('AuthContext: Unexpected Google sign-in error:', error);
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
      console.log('AuthContext: Starting sign out...');
      setLoading(true);
      
      const signOutPromise = supabase.auth.signOut();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sign out timeout')), 10000)
      );

      const { error } = await Promise.race([
        signOutPromise,
        timeoutPromise
      ]) as any;

      if (error) {
        console.error('AuthContext: Sign out error:', error);
        return { error: { message: error.message, status: 400 } };
      }

      // Clear state immediately
      setUser(null);
      setProfile(null);
      setSession(null);
      
      console.log('AuthContext: User signed out successfully');
      return { error: null };
    } catch (error) {
      console.error('AuthContext: Unexpected sign out error:', error);
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

      console.log('AuthContext: Updating profile for:', user.id);
      setLoading(true);

      const updatePromise = supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();
        
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile update timeout')), 10000)
      );

      const { data, error } = await Promise.race([
        updatePromise,
        timeoutPromise
      ]) as any;

      if (error) {
        console.error('AuthContext: Profile update error:', error);
        return { error: { message: error.message, status: 400 } };
      }

      console.log('AuthContext: Profile updated successfully');
      setProfile(data);
      return { error: null };
    } catch (error) {
      console.error('AuthContext: Profile update exception:', error);
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
      console.log('AuthContext: Sending password reset for:', email);
      
      const resetPromise = supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Password reset timeout')), 10000)
      );

      const { error } = await Promise.race([
        resetPromise,
        timeoutPromise
      ]) as any;

      if (error) {
        console.error('AuthContext: Password reset error:', error);
        return { error: { message: error.message, status: 400 } };
      }

      console.log('AuthContext: Password reset email sent');
      return { error: null };
    } catch (error) {
      console.error('AuthContext: Password reset exception:', error);
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