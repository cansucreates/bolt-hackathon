import React from 'react';
import { Heart, Home } from 'lucide-react';

const AdoptionHeader: React.FC = () => {
  return (
    <div className="relative pt-24 pb-16 text-center">
      <div className="max-w-4xl mx-auto px-4">
        {/* Bouncing Home Icon */}
        <div className="mb-8">
          <div className="inline-block bouncing-paw">
            <Home size={64} className="text-kawaii-pink-dark fill-kawaii-pink-dark" />
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
          🏠 Find Your Furever Friend
        </h1>

        {/* Subtitle */}
        <h2 className="text-xl md:text-2xl text-gray-700 font-quicksand flex items-center justify-center gap-2 flex-wrap">
          These animals have been waiting for a loving home 
          <span className="flex items-center gap-1">
            🐾💗
            <Heart size={24} className="text-kawaii-pink-dark fill-kawaii-pink-dark animate-pulse" />
          </span>
        </h2>

        {/* Description */}
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto font-quicksand">
          Every pet deserves a loving family. Browse our adorable animals ready for adoption and give them the forever home they've been dreaming of.
        </p>
      </div>
    </div>
  );
};

export default AdoptionHeader;