import React from 'react';
import { Stethoscope, Heart, Home } from 'lucide-react';

const VetHeader: React.FC = () => {
  return (
    <div className="relative pt-24 pb-16 text-center">
      <div className="max-w-4xl mx-auto px-4">
        {/* Bouncing Stethoscope Icon */}
        <div className="mb-8">
          <div className="inline-block bouncing-paw">
            <div className="flex items-center gap-2">
              <Stethoscope size={64} className="text-kawaii-blue-dark" />
              <Home size={48} className="text-kawaii-pink-dark" />
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
          🩺 Find Veterinary Care
        </h1>

        {/* Subtitle */}
        <h2 className="text-xl md:text-2xl text-gray-700 font-quicksand flex items-center justify-center gap-2 flex-wrap">
          Professional and volunteer veterinarians ready to help 
          <span className="flex items-center gap-1">
            🐾💙
            <Heart size={24} className="text-kawaii-blue-dark fill-kawaii-blue-dark animate-pulse" />
          </span>
        </h2>

        {/* Slogan */}
        <div className="mt-4 mb-6">
          <p className="text-2xl md:text-3xl font-bold text-kawaii-yellow-dark font-quicksand">
            🏡 "Send every paw back home."
          </p>
        </div>

        {/* Description */}
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto font-quicksand">
          Connect with qualified veterinarians in your area for emergency care, routine checkups, and specialized treatments for your beloved pets through PawBackHome.
        </p>
      </div>
    </div>
  );
};

export default VetHeader;