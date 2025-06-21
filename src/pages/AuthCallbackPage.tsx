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

        console.log('Auth callback page loaded, processing authentication...');
        console.log('Current URL:', window.location.href);
        console.log('URL search params:', window.location.search);

        // Handle the OAuth callback by exchanging the code for a session
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
          }, 2000);
          return;
        }

        if (data.session) {
          // Successfully authenticated
          console.log('Authentication successful for user:', data.session.user.email);
          
          // Show success message briefly before redirecting
          setIsProcessing(false);
          
          // Redirect to home page after a short delay
          setTimeout(() => {
            navigate('/', { 
              replace: true,
              state: { 
                authSuccess: `Welcome back, ${data.session.user.email}!` 
              }
            });
          }, 1500);
        } else {
          // No session found - try to handle the OAuth callback manually
          console.log('No session found, attempting to handle OAuth callback...');
          
          // Check if we have OAuth parameters in the URL
          const urlParams = new URLSearchParams(window.location.search);
          const code = urlParams.get('code');
          const error_code = urlParams.get('error');
          const error_description = urlParams.get('error_description');

          if (error_code) {
            console.error('OAuth error:', error_code, error_description);
            setError(`Authentication failed: ${error_description || error_code}`);
            
            setTimeout(() => {
              navigate('/', { 
                replace: true,
                state: { 
                  authError: `Authentication failed: ${error_description || 'Please try again.'}` 
                }
              });
            }, 2000);
            return;
          }

          if (code) {
            console.log('Found OAuth code, exchanging for session...');
            
            // Exchange the code for a session
            const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
            
            if (sessionError) {
              console.error('Error exchanging code for session:', sessionError);
              setError('Failed to complete authentication. Please try again.');
              
              setTimeout(() => {
                navigate('/', { 
                  replace: true,
                  state: { 
                    authError: 'Failed to complete authentication. Please try again.' 
                  }
                });
              }, 2000);
              return;
            }

            if (sessionData.session) {
              console.log('Successfully exchanged code for session:', sessionData.session.user.email);
              setIsProcessing(false);
              
              setTimeout(() => {
                navigate('/', { 
                  replace: true,
                  state: { 
                    authSuccess: `Welcome, ${sessionData.session.user.email}!` 
                  }
                });
              }, 1500);
              return;
            }
          }

          // If we get here, something went wrong
          console.warn('No session or OAuth code found in callback');
          setError('Authentication session not found.');
          
          setTimeout(() => {
            navigate('/', { 
              replace: true,
              state: { 
                authError: 'Authentication session not found. Please try again.' 
              }
            });
          }, 2000);
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
        }, 2000);
      } finally {
        if (isProcessing) {
          setIsProcessing(false);
        }
      }
    };

    // Run the callback handler
    handleAuthCallback();
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