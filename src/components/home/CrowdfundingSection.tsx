import React, { useState, useEffect } from 'react';
import { Heart, DollarSign, ArrowRight, Coins } from 'lucide-react';
import { Link } from '../navigation/Link';
import { Campaign } from '../../types/crowdfunding';

// Mock featured campaigns for homepage
const featuredCampaigns: Campaign[] = [
  {
    id: '1',
    animalName: 'Luna',
    species: 'dog',
    image: 'https://images.pexels.com/photos/1490908/pexels-photo-1490908.jpeg',
    story: 'Luna needs urgent surgery after being hit by a car. This brave golden retriever is fighting for her life and needs our help.',
    location: 'Austin, TX',
    goalAmount: 5000,
    currentAmount: 3200,
    donorCount: 89,
    daysLeft: 12,
    isEmergency: true,
    isVetVerified: true,
    status: 'active',
    shelter: 'Austin Animal Emergency',
    medicalCondition: 'Broken leg, internal injuries',
    isFeatured: true,
    createdAt: '2025-01-15',
    lastUpdated: '2025-01-20'
  },
  {
    id: '2',
    animalName: 'Whiskers',
    species: 'cat',
    image: 'https://images.pexels.com/photos/2061057/pexels-photo-2061057.jpeg',
    story: 'Whiskers was found with severe malnutrition and needs specialized care to recover. Help us give this sweet cat a second chance.',
    location: 'Portland, OR',
    goalAmount: 2500,
    currentAmount: 1800,
    donorCount: 45,
    daysLeft: 8,
    isEmergency: false,
    isVetVerified: true,
    status: 'active',
    shelter: 'Oregon Cat Rescue',
    medicalCondition: 'Malnutrition, dental issues',
    isFeatured: false,
    createdAt: '2025-01-10',
    lastUpdated: '2025-01-19'
  },
  {
    id: '3',
    animalName: 'Buddy',
    species: 'dog',
    image: 'https://images.pexels.com/photos/1629781/pexels-photo-1629781.jpeg',
    story: 'Buddy is a senior dog who needs ongoing medical care for his arthritis. Your support helps him live comfortably in his golden years.',
    location: 'Denver, CO',
    goalAmount: 3000,
    currentAmount: 2100,
    donorCount: 67,
    daysLeft: 15,
    isEmergency: false,
    isVetVerified: true,
    status: 'active',
    shelter: 'Denver Senior Pet Sanctuary',
    medicalCondition: 'Arthritis, hip dysplasia',
    isFeatured: false,
    createdAt: '2025-01-12',
    lastUpdated: '2025-01-18'
  }
];

const CrowdfundingSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-slide functionality
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredCampaigns.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  const formatAmount = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}k`;
    }
    return `$${amount}`;
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-kawaii-yellow/10 via-kawaii-pink/10 to-transparent relative overflow-hidden">
      {/* Floating Coins Animation */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="absolute animate-float"
            style={{
              left: `${10 + (index * 12)}%`,
              top: `${20 + (index % 3) * 25}%`,
              animationDelay: `${index * 0.5}s`,
              animationDuration: `${3 + (index % 2)}s`
            }}
          >
            <Coins 
              size={20 + (index % 3) * 8} 
              className="text-kawaii-yellow-dark opacity-20" 
            />
          </div>
        ))}
      </div>

      <div className="kawaii-container relative z-10">
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="inline-block bouncing-paw">
              <Heart size={48} className="text-kawaii-yellow-dark fill-kawaii-yellow-dark" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Help Our Furry Friends 🐾
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-quicksand">
            Every donation brings hope and healing to animals in need
          </p>
        </div>

        {/* Campaign Carousel */}
        <div 
          className="relative max-w-5xl mx-auto mb-8"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="overflow-hidden rounded-kawaii">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {featuredCampaigns.map((campaign) => (
                <div key={campaign.id} className="w-full flex-shrink-0">
                  <div className="bg-white/90 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-yellow/30 overflow-hidden mx-2">
                    <div className="flex flex-col md:flex-row">
                      
                      {/* Image Section */}
                      <div className="md:w-1/2 relative">
                        <div className="aspect-video md:aspect-square">
                          <img
                            src={campaign.image}
                            alt={campaign.animalName}
                            className="w-full h-full object-cover"
                          />
                          {campaign.isEmergency && (
                            <div className="absolute top-4 left-4 bg-red-100 border border-red-200 text-red-700 px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
                              🚨 Emergency
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                              <Heart size={24} className="text-kawaii-yellow-dark" />
                              {campaign.animalName}
                            </h3>
                            <span className="text-sm font-semibold text-gray-600 bg-kawaii-yellow/50 px-3 py-1 rounded-full capitalize">
                              {campaign.species}
                            </span>
                          </div>

                          <p className="text-gray-700 font-quicksand leading-relaxed mb-4 line-clamp-3">
                            {campaign.story}
                          </p>

                          <div className="text-sm text-gray-600 mb-4">
                            <p className="flex items-center gap-1 mb-1">
                              📍 {campaign.location}
                            </p>
                            <p>🏥 {campaign.shelter}</p>
                          </div>
                        </div>

                        {/* Progress Section */}
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-gray-800">
                                {formatAmount(campaign.currentAmount)} raised
                              </span>
                              <span className="text-sm text-gray-600">
                                of {formatAmount(campaign.goalAmount)}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-kawaii-yellow to-kawaii-yellow-dark rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${getProgressPercentage(campaign.currentAmount, campaign.goalAmount)}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span>{Math.round(getProgressPercentage(campaign.currentAmount, campaign.goalAmount))}% funded</span>
                              <span>{campaign.donorCount} donors • {campaign.daysLeft} days left</span>
                            </div>
                          </div>

                          {/* Donate Button */}
                          <button className="w-full py-3 px-6 bg-kawaii-yellow hover:bg-kawaii-yellow-dark text-gray-700 font-bold rounded-kawaii transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-md">
                            <DollarSign size={20} />
                            Donate Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-6 gap-2">
            {featuredCampaigns.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-kawaii-yellow-dark scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link to="/crowdfunding">
            <button className="kawaii-button bg-kawaii-pink hover:bg-kawaii-pink-dark text-gray-700 font-bold py-4 px-8 text-lg flex items-center gap-3 mx-auto shadow-lg">
              <Heart size={24} />
              View All Campaigns
              <ArrowRight size={20} />
            </button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-kawaii border border-kawaii-yellow/30">
            <div className="text-2xl font-bold text-kawaii-yellow-dark mb-1">$127k+</div>
            <div className="text-sm text-gray-600 font-quicksand">Total Raised</div>
          </div>
          <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-kawaii border border-kawaii-green/30">
            <div className="text-2xl font-bold text-kawaii-green-dark mb-1">342</div>
            <div className="text-sm text-gray-600 font-quicksand">Animals Helped</div>
          </div>
          <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-kawaii border border-kawaii-pink/30">
            <div className="text-2xl font-bold text-kawaii-pink-dark mb-1">1,856</div>
            <div className="text-sm text-gray-600 font-quicksand">Kind Donors</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CrowdfundingSection;