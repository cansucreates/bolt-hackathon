import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setIsProcessing(true);
        setError(null);

        // Handle the auth callback from Supabase
        const { data, error: authError } = await supabase.auth.getSession();
        
        if (authError) {
          console.error('Auth callback error:', authError);
          setError('Authentication failed. Please try again.');
          
          // Redirect to home page with error state after a delay
          setTimeout(() => {
            navigate('/', { 
              replace: true, 
              state: { 
                authError: 'Authentication failed. Please try again.' 
              } 
            });
          }, 3000);
          return;
        }

        if (data.session) {
          // Successfully authenticated
          console.log('Authentication successful:', data.session.user.email);
          
          // Check if there's a redirect URL in the state
          const redirectTo = location.state?.from?.pathname || '/';
          
          // Small delay to ensure the auth context is updated
          setTimeout(() => {
            navigate(redirectTo, { 
              replace: true,
              state: { 
                authSuccess: 'Successfully signed in!' 
              }
            });
          }, 1000);
        } else {
          // No session found - this might be a failed auth attempt
          console.warn('No session found in auth callback');
          setError('No authentication session found.');
          
          setTimeout(() => {
            navigate('/', { 
              replace: true,
              state: { 
                authError: 'Authentication session not found. Please try again.' 
              }
            });
          }, 3000);
        }
      } catch (error) {
        console.error('Unexpected error during auth callback:', error);
        setError('An unexpected error occurred during authentication.');
        
        setTimeout(() => {
          navigate('/', { 
            replace: true,
            state: { 
              authError: 'An unexpected error occurred. Please try again.' 
            }
          });
        }, 3000);
      } finally {
        setIsProcessing(false);
      }
    };

    // Only run the callback handler if we're actually on the callback page
    if (location.pathname === '/auth/callback') {
      handleAuthCallback();
    }
  }, [navigate, location]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-kawaii-pink via-kawaii-blue to-kawaii-purple">
        <div className="text-center bg-white/90 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-red-300 p-8 max-w-md mx-4">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-700 mb-4">Authentication Failed</h2>
          <p className="text-red-600 font-quicksand mb-4">{error}</p>
          <p className="text-sm text-gray-600 font-quicksand">
            Redirecting you back to the home page...
          </p>
          <div className="mt-4">
            <div className="w-8 h-8 border-4 border-red-300 border-t-red-600 rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-kawaii-pink via-kawaii-blue to-kawaii-purple">
      <div className="text-center bg-white/90 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-pink/30 p-8 max-w-md mx-4">
        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {isProcessing ? 'Completing Sign In...' : 'Authentication Successful!'}
        </h2>
        <p className="text-gray-600 font-quicksand mb-4">
          {isProcessing 
            ? 'Please wait while we finish setting up your account.' 
            : 'Welcome to PawConnect! Redirecting you now...'
          }
        </p>
        <div className="w-16 h-16 border-4 border-kawaii-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
};

export default AuthCallbackPage;