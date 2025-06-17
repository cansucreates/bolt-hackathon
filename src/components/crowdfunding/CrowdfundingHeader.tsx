import React from 'react';
import { Heart, Coins } from 'lucide-react';

const CrowdfundingHeader: React.FC = () => {
  return (
    <div className="relative pt-24 pb-16 text-center">
      <div className="max-w-4xl mx-auto px-4">
        {/* Bouncing Coins Icon */}
        <div className="mb-8">
          <div className="inline-block bouncing-paw">
            <Coins size={64} className="text-kawaii-yellow-dark" />
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
          💰 Help Our Furry Friends
        </h1>

        {/* Subtitle */}
        <h2 className="text-xl md:text-2xl text-gray-700 font-quicksand flex items-center justify-center gap-2 flex-wrap">
          Every donation brings hope and healing 
          <span className="flex items-center gap-1">
            🐾💛
            <Heart size={24} className="text-kawaii-yellow-dark fill-kawaii-yellow-dark animate-pulse" />
          </span>
        </h2>

        {/* Description */}
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto font-quicksand">
          Support animals in need with medical care, rescue operations, and finding forever homes. Your contribution makes a real difference in their lives.
        </p>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-kawaii p-4 border border-kawaii-yellow/30">
            <div className="text-2xl font-bold text-kawaii-yellow-dark">$127,450</div>
            <div className="text-sm text-gray-600 font-quicksand">Total Raised</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-kawaii p-4 border border-kawaii-green/30">
            <div className="text-2xl font-bold text-kawaii-green-dark">342</div>
            <div className="text-sm text-gray-600 font-quicksand">Animals Helped</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-kawaii p-4 border border-kawaii-pink/30">
            <div className="text-2xl font-bold text-kawaii-pink-dark">1,856</div>
            <div className="text-sm text-gray-600 font-quicksand">Kind Donors</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrowdfundingHeader;