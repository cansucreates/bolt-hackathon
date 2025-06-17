import React from 'react';
import { PawPrint, Heart } from 'lucide-react';

const LostFoundHeader: React.FC = () => {
  return (
    <div className="relative pt-24 pb-16 text-center">
      <div className="max-w-4xl mx-auto px-4">
        {/* Bouncing Paw Icon */}
        <div className="mb-8">
          <div className="inline-block bouncing-paw">
            <PawPrint size={64} className="text-kawaii-pink-dark fill-kawaii-pink-dark" />
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
          Lost & Found Pets
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-700 font-quicksand flex items-center justify-center gap-2">
          Reuniting families, one paw at a time 
          <Heart size={24} className="text-kawaii-pink-dark fill-kawaii-pink-dark animate-pulse" />
        </p>

        {/* Description */}
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto font-quicksand">
          Help lost pets find their way home or report a found pet to reunite them with their worried families
        </p>
      </div>
    </div>
  );
};

export default LostFoundHeader;