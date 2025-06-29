import React, { useState } from 'react';
import { Heart, TrendingUp, Users, Calendar, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import DonationHistory from '../components/donation/DonationHistory';
import DonationStats from '../components/donation/DonationStats';
import StripeProvider from '../components/donation/StripeProvider';

const DonationPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'stats'>('overview');

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
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-yellow/30 p-2 flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2 px-6 py-3 rounded-kawaii font-bold transition-all duration-300 ${
                  activeTab === 'overview'
                    ? 'bg-kawaii-yellow text-gray-700 shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <TrendingUp size={20} />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 px-6 py-3 rounded-kawaii font-bold transition-all duration-300 ${
                  activeTab === 'history'
                    ? 'bg-kawaii-yellow text-gray-700 shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Calendar size={20} />
                History
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`flex items-center gap-2 px-6 py-3 rounded-kawaii font-bold transition-all duration-300 ${
                  activeTab === 'stats'
                    ? 'bg-kawaii-yellow text-gray-700 shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Users size={20} />
                Campaign Stats
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <StripeProvider>
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="bg-white/90 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-yellow/30 p-8 text-center">
                  <Heart size={64} className="text-kawaii-yellow-dark mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Welcome to Your Donation Dashboard
                  </h2>
                  <p className="text-lg text-gray-600 font-quicksand max-w-2xl mx-auto mb-6">
                    Here you can track all your contributions to help animals in need, view your donation history, 
                    and see the real impact you're making in the lives of pets looking for their forever homes.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="p-6 bg-kawaii-pink/20 rounded-kawaii">
                      <Heart size={32} className="text-kawaii-pink-dark mx-auto mb-3" />
                      <h3 className="font-bold text-gray-800 mb-2">Make a Difference</h3>
                      <p className="text-sm text-gray-600 font-quicksand">
                        Every donation helps provide medical care, shelter, and love to animals in need.
                      </p>
                    </div>
                    
                    <div className="p-6 bg-kawaii-blue/20 rounded-kawaii">
                      <TrendingUp size={32} className="text-kawaii-blue-dark mx-auto mb-3" />
                      <h3 className="font-bold text-gray-800 mb-2">Track Your Impact</h3>
                      <p className="text-sm text-gray-600 font-quicksand">
                        See how your contributions are helping animals find their way back home.
                      </p>
                    </div>
                    
                    <div className="p-6 bg-kawaii-green/20 rounded-kawaii">
                      <Users size={32} className="text-kawaii-green-dark mx-auto mb-3" />
                      <h3 className="font-bold text-gray-800 mb-2">Join the Community</h3>
                      <p className="text-sm text-gray-600 font-quicksand">
                        Connect with other animal lovers making a difference in their communities.
                      </p>
                    </div>
                  </div>
                </div>
                
                {user && <DonationHistory />}
              </div>
            )}

            {activeTab === 'history' && user && <DonationHistory />}

            {activeTab === 'stats' && (
              <DonationStats campaignId="sample-campaign-id" />
            )}

            {!user && (
              <div className="bg-white/90 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-pink/30 p-8 text-center">
                <Heart size={64} className="text-kawaii-pink-dark mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Sign in to view your donation dashboard
                </h2>
                <p className="text-gray-600 font-quicksand mb-6">
                  Create an account or sign in to track your donations and see the impact you're making.
                </p>
                <button className="kawaii-button bg-kawaii-pink hover:bg-kawaii-pink-dark text-gray-700 font-bold py-3 px-6">
                  Sign In
                </button>
              </div>
            )}
          </StripeProvider>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;