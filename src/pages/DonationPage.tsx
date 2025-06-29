import React, { useState, useEffect } from 'react';
import { Heart, Home, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import DonationDashboard from '../components/donation/DonationDashboard';
import { useLocation, useNavigate } from 'react-router-dom';

const DonationPage: React.FC = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Check for success or canceled query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get('success');
    const canceled = params.get('canceled');
    const amount = params.get('amount');
    const campaign = params.get('campaign');

    if (success === 'true') {
      setMessage({ 
        type: 'success', 
        text: `Thank you for your donation${amount ? ` of $${amount}` : ''}! Your support helps animals in need.` 
      });
      // Clean up URL
      navigate('/donations', { replace: true });
    } else if (canceled === 'true') {
      setMessage({ 
        type: 'error', 
        text: "Your donation was canceled. Please try again if you'd like to support our cause." 
      });
      // Clean up URL
      navigate('/donations', { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="floating-heart absolute top-20 left-10 w-6 h-6 text-kawaii-yellow-dark opacity-30">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
        <div className="floating-heart absolute top-40 right-20 w-8 h-8 text-kawaii-yellow-dark opacity-25" style={{ animationDelay: '1s' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
      </div>

      <div className="relative z-10 pt-24 pb-16">
        {/* Header */}
        <div className="max-w-4xl mx-auto px-4 text-center mb-12">
          <div className="mb-8">
            <div className="inline-block bouncing-paw">
              <div className="flex items-center gap-2">
                <Heart size={64} className="text-kawaii-yellow-dark fill-kawaii-yellow-dark" />
                <Home size={48} className="text-kawaii-pink-dark" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
            💝 Donation Dashboard
          </h1>
          <p className="text-xl text-gray-700 font-quicksand max-w-2xl mx-auto mb-4">
            Track your contributions and see the impact you're making in helping animals find their way home
          </p>
          <p className="text-2xl md:text-3xl font-bold text-kawaii-yellow-dark font-quicksand">
            🏡 "Send every paw back home."
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-4">
          {/* Status Message */}
          {message && (
            <div className={`mb-8 p-4 rounded-kawaii flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle size={24} className="flex-shrink-0" />
              ) : (
                <AlertTriangle size={24} className="flex-shrink-0" />
              )}
              <p className="font-quicksand">{message.text}</p>
            </div>
          )}

          {/* Dashboard Content */}
          <DonationDashboard />
        </div>
      </div>
    </div>
  );
};

export default DonationPage;