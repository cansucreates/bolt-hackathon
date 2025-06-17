import React from 'react';
import { Stethoscope, Heart } from 'lucide-react';

const VetHeader: React.FC = () => {
  return (
    <div className="relative pt-24 pb-16 text-center">
      <div className="max-w-4xl mx-auto px-4">
        {/* Bouncing Stethoscope Icon */}
        <div className="mb-8">
          <div className="inline-block bouncing-paw">
            <Stethoscope size={64} className="text-kawaii-blue-dark" />
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

        {/* Description */}
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto font-quicksand">
          Connect with qualified veterinarians in your area for emergency care, routine checkups, and specialized treatments for your beloved pets.
        </p>
      </div>
    </div>
  );
};

export default VetHeader;