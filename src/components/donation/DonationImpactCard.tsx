import React from 'react';
import { Heart, Paw, Home, Award, Star, Medal, Trophy } from 'lucide-react';
import { formatCurrency } from '../../lib/donationService';

interface DonationImpactCardProps {
  stats: {
    totalDonated: number;
    donationCount: number;
    animalsHelped: number;
    impactPoints: number;
  };
}

const DonationImpactCard: React.FC<DonationImpactCardProps> = ({ stats }) => {
  // Calculate impact metrics
  const mealsProvided = Math.floor(stats.totalDonated * 2); // 2 meals per dollar
  const shelterDays = Math.floor(stats.totalDonated / 15); // $15 per day of shelter
  const medicalCare = Math.floor(stats.totalDonated / 50); // $50 per medical treatment
  const level = Math.max(1, Math.floor(stats.impactPoints / 100));
  
  // Determine badges based on donation amount and count
  const badges = [
    { name: 'First Steps', icon: <Paw size={16} />, unlocked: stats.donationCount >= 1, color: 'bg-kawaii-pink/30 text-gray-700' },
    { name: 'Helping Hand', icon: <Heart size={16} />, unlocked: stats.totalDonated >= 50, color: 'bg-kawaii-blue/30 text-gray-700' },
    { name: 'Animal Friend', icon: <Star size={16} />, unlocked: stats.totalDonated >= 100, color: 'bg-kawaii-green/30 text-gray-700' },
    { name: 'Compassionate Heart', icon: <Medal size={16} />, unlocked: stats.donationCount >= 5, color: 'bg-kawaii-purple/30 text-gray-700' },
    { name: 'Guardian Angel', icon: <Trophy size={16} />, unlocked: stats.totalDonated >= 250, color: 'bg-kawaii-yellow/30 text-gray-700' },
    { name: 'Animal Champion', icon: <Award size={16} />, unlocked: stats.totalDonated >= 500, color: 'bg-red-100 text-red-700' },
    { name: 'Lifesaver', icon: <Home size={16} />, unlocked: stats.animalsHelped >= 10, color: 'bg-blue-100 text-blue-700' },
  ];

  // Calculate progress to next level
  const nextLevelPoints = (level + 1) * 100;
  const currentLevelPoints = level * 100;
  const pointsToNextLevel = nextLevelPoints - stats.impactPoints;
  const progressPercentage = ((stats.impactPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Your Impact</h3>
      
      {/* Impact Level */}
      <div className="bg-kawaii-yellow/20 rounded-kawaii p-6 border border-kawaii-yellow/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold text-gray-800 mb-1">Impact Level {level}</h4>
            <p className="text-gray-600 font-quicksand">
              {stats.impactPoints} impact points earned
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-kawaii-yellow flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-700">{level}</span>
            </div>
          </div>
        </div>
        
        {/* Progress to Next Level */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Level {level}</span>
            <span>Level {level + 1}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="h-full bg-gradient-to-r from-kawaii-yellow to-kawaii-yellow-dark rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 text-center">
            {pointsToNextLevel} more points until Level {level + 1}
          </p>
        </div>
      </div>
      
      {/* Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-pink/30 p-6 text-center">
          <Heart size={32} className="text-kawaii-pink-dark mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">
            {mealsProvided}
          </div>
          <div className="text-sm text-gray-600">Meals Provided</div>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-blue/30 p-6 text-center">
          <Home size={32} className="text-kawaii-blue-dark mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">
            {shelterDays}
          </div>
          <div className="text-sm text-gray-600">Days of Shelter</div>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-green/30 p-6 text-center">
          <Paw size={32} className="text-kawaii-green-dark mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">
            {medicalCare}
          </div>
          <div className="text-sm text-gray-600">Medical Treatments</div>
        </div>
      </div>
      
      {/* Badges */}
      <div className="bg-white/90 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-purple/30 p-6">
        <h4 className="text-lg font-bold text-gray-800 mb-4">Your Impact Badges</h4>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {badges.map((badge, index) => (
            <div 
              key={index}
              className={`p-4 rounded-kawaii text-center ${
                badge.unlocked 
                  ? badge.color
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                badge.unlocked 
                  ? 'bg-white/80'
                  : 'bg-gray-200'
              }`}>
                {badge.icon}
              </div>
              <div className="font-bold text-sm">
                {badge.name}
              </div>
              <div className="text-xs mt-1">
                {badge.unlocked ? 'Unlocked' : 'Locked'}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Impact Story */}
      <div className="bg-kawaii-green/20 rounded-kawaii p-6 border border-kawaii-green/30">
        <h4 className="text-lg font-bold text-gray-800 mb-3">Your Impact Story</h4>
        <p className="text-gray-700 font-quicksand leading-relaxed">
          Thanks to your generous donations of {formatCurrency(stats.totalDonated)}, you've helped provide {mealsProvided} meals, 
          {shelterDays} days of shelter, and {medicalCare} medical treatments for animals in need. Your support has directly 
          contributed to helping {stats.animalsHelped} animals on their journey back home. Every dollar you donate makes a real 
          difference in the lives of these precious animals.
        </p>
      </div>
    </div>
  );
};

export default DonationImpactCard;