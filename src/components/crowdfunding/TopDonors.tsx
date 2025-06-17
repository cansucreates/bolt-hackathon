import React from 'react';
import { Crown, Heart, Star, Award, Shield } from 'lucide-react';
import { Donor } from '../../types/crowdfunding';

interface TopDonorsProps {
  donors: Donor[];
}

const TopDonors: React.FC<TopDonorsProps> = ({ donors }) => {
  const getBadgeIcon = (badgeName: string) => {
    switch (badgeName.toLowerCase()) {
      case 'animal hero':
        return <Crown size={16} className="text-yellow-500" />;
      case 'compassionate heart':
        return <Heart size={16} className="text-red-500" />;
      case 'guardian angel':
        return <Shield size={16} className="text-blue-500" />;
      case 'super supporter':
        return <Star size={16} className="text-purple-500" />;
      default:
        return <Award size={16} className="text-green-500" />;
    }
  };

  const formatAmount = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}k`;
    }
    return `$${amount}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 mb-12">
      <div className="bg-white/80 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-pink/30 p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <Crown size={24} className="text-kawaii-yellow-dark" />
            Top Donors This Month
          </h2>
          <p className="text-gray-600 font-quicksand">
            Celebrating our most generous supporters
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {donors.slice(0, 6).map((donor, index) => (
            <div 
              key={donor.id}
              className={`p-4 rounded-kawaii border-2 transition-all duration-300 hover:scale-105 ${
                index === 0 
                  ? 'bg-gradient-to-br from-kawaii-yellow/30 to-kawaii-yellow/10 border-kawaii-yellow shadow-lg' 
                  : index === 1
                  ? 'bg-gradient-to-br from-gray-200/30 to-gray-100/10 border-gray-300'
                  : index === 2
                  ? 'bg-gradient-to-br from-orange-200/30 to-orange-100/10 border-orange-300'
                  : 'bg-white/60 border-kawaii-pink/30'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                {/* Rank Badge */}
                {index < 3 && (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-yellow-400 text-yellow-900' :
                    index === 1 ? 'bg-gray-400 text-gray-900' :
                    'bg-orange-400 text-orange-900'
                  }`}>
                    {index + 1}
                  </div>
                )}

                {/* Avatar */}
                <img 
                  src={donor.avatar} 
                  alt={donor.username}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-800 truncate">
                      {donor.isAnonymous ? 'Anonymous Donor' : donor.username}
                    </h3>
                    {index === 0 && <Crown size={16} className="text-yellow-500" />}
                  </div>
                  <p className="text-sm font-semibold text-kawaii-green-dark">
                    {formatAmount(donor.totalDonated)} donated
                  </p>
                </div>
              </div>

              {/* Badges */}
              {donor.badges.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {donor.badges.slice(0, 3).map((badge) => (
                    <div 
                      key={badge.id}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${badge.color}`}
                      title={badge.description}
                    >
                      {getBadgeIcon(badge.name)}
                      <span className="hidden sm:inline">{badge.name}</span>
                    </div>
                  ))}
                  {donor.badges.length > 3 && (
                    <div className="px-2 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600">
                      +{donor.badges.length - 3}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-6">
          <button className="px-6 py-3 bg-kawaii-pink hover:bg-kawaii-pink-dark text-gray-700 font-bold rounded-kawaii transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 mx-auto">
            <Heart size={18} />
            View All Donors
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopDonors;