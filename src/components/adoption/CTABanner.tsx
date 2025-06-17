import React from 'react';
import { Share2, Heart, Users, DollarSign } from 'lucide-react';

const CTABanner: React.FC = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <div className="mb-8">
          <div className="inline-block bouncing-paw">
            <Heart size={64} className="text-kawaii-pink-dark fill-kawaii-pink-dark" />
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Can't adopt? 💕 You can still help!
        </h2>
        
        <p className="text-xl text-gray-700 mb-8 font-quicksand max-w-2xl mx-auto">
          Every small action makes a big difference in the lives of these precious animals waiting for their forever homes.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          {/* Share Button */}
          <button className="bg-white/95 hover:bg-white text-gray-700 font-bold py-4 px-6 rounded-kawaii shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 backdrop-blur-sm border border-kawaii-blue/30">
            <Share2 size={20} className="text-kawaii-blue-dark" />
            <span>📤 Share</span>
          </button>

          {/* Donate Button */}
          <button className="bg-white/95 hover:bg-white text-gray-700 font-bold py-4 px-6 rounded-kawaii shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 backdrop-blur-sm border border-kawaii-green/30">
            <DollarSign size={20} className="text-kawaii-green-dark" />
            <span>💖 Donate</span>
          </button>

          {/* Volunteer Button */}
          <button className="bg-white/95 hover:bg-white text-gray-700 font-bold py-4 px-6 rounded-kawaii shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 backdrop-blur-sm border border-kawaii-purple/30">
            <Users size={20} className="text-kawaii-purple-dark" />
            <span>🤝 Volunteer</span>
          </button>

          {/* Foster Button */}
          <button className="bg-white/95 hover:bg-white text-gray-700 font-bold py-4 px-6 rounded-kawaii shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 backdrop-blur-sm border border-kawaii-pink/30">
            <Heart size={20} className="text-kawaii-pink-dark" />
            <span>🏠 Foster</span>
          </button>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-kawaii p-6 border border-kawaii-pink/30 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            🌟 Make a Difference Today
          </h3>
          <p className="text-gray-700 font-quicksand">
            Share a pet's profile on social media, donate to help with medical care, volunteer at local shelters, 
            or consider fostering. Every act of kindness brings these animals one step closer to finding their forever families.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;