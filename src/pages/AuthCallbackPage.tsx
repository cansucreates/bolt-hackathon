import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/', { replace: true });
          return;
        }

        if (data.session) {
          // Successfully authenticated
          navigate('/', { replace: true });
        } else {
          // No session found
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Unexpected error during auth callback:', error);
        navigate('/', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-kawaii-pink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Completing Sign In...</h2>
        <p className="text-gray-600 font-quicksand">Please wait while we finish setting up your account.</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;