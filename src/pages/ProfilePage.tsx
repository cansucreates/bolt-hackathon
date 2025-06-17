import React from 'react';
import UserProfile from '../components/auth/UserProfile';

const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="floating-heart absolute top-20 left-10 w-6 h-6 text-kawaii-pink-dark opacity-30">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
        <div className="floating-heart absolute top-40 right-20 w-8 h-8 text-kawaii-pink-dark opacity-25" style={{ animationDelay: '1s' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
      </div>

      <div className="relative z-10 pt-24 pb-16">
        {/* Header */}
        <div className="max-w-4xl mx-auto px-4 text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
            👤 My Profile
          </h1>
          <p className="text-xl text-gray-700 font-quicksand max-w-2xl mx-auto">
            Manage your account settings and view your PawConnect activity
          </p>
        </div>

        <UserProfile />
      </div>
    </div>
  );
};

export default ProfilePage;