import React, { useState } from 'react';
import { MapPin, Calendar, Heart, DollarSign, Users, Shield, AlertTriangle, Star, TrendingUp, Clock } from 'lucide-react';
import { Campaign } from '../../types/crowdfunding';
import { formatCurrency } from '../../lib/donationService';
import DonationStats from '../donation/DonationStats';

interface EnhancedCampaignCardProps {
  campaign: Campaign;
  onDonate: (campaign: Campaign) => void;
  isFeatured?: boolean;
  showStats?: boolean;
}

const EnhancedCampaignCard: React.FC<EnhancedCampaignCardProps> = ({ 
  campaign, 
  onDonate, 
  isFeatured = false,
  showStats = false 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showFullStats, setShowFullStats] = useState(false);

  const progressPercentage = Math.min((campaign.currentAmount / campaign.goalAmount) * 100, 100);
  const isCompleted = campaign.status === 'completed' || campaign.status === 'adopted' || campaign.status === 'healed';
  const daysLeftColor = campaign.daysLeft <= 3 ? 'text-red-600' : campaign.daysLeft <= 7 ? 'text-orange-600' : 'text-gray-600';

  const getStatusBadge = () => {
    switch (campaign.status) {
      case 'adopted':
        return (
          <span className="absolute top-4 left-4 bg-kawaii-pink text-gray-700 px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
            <Heart size={14} />
            Adopted
          </span>
        );
      case 'healed':
        return (
          <span className="absolute top-4 left-4 bg-kawaii-green text-gray-700 px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
            <Star size={14} />
            Healed
          </span>
        );
      case 'completed':
        return (
          <span className="absolute top-4 left-4 bg-kawaii-blue text-gray-700 px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            Goal Reached
          </span>
        );
      default:
        return null;
    }
  };

  const cardClasses = `
    kawaii-pet-card group h-full flex flex-col relative overflow-hidden
    ${isFeatured ? 'ring-4 ring-kawaii-yellow ring-opacity-50 shadow-2xl' : ''}
    ${isFeatured ? 'animate-pulse-border' : ''}
  `;

  return (
    <div className={cardClasses}>
      {/* Featured Banner */}
      {isFeatured && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-kawaii-yellow to-kawaii-yellow-dark text-gray-700 px-4 py-2 rounded-bl-kawaii font-bold text-sm z-20 shadow-lg">
          ⭐ Featured
        </div>
      )}

      {/* Image Container */}
      <div className="relative overflow-hidden rounded-t-kawaii">
        <div className="aspect-video bg-gray-200 relative">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-kawaii-yellow/20 animate-pulse flex items-center justify-center">
              <Heart size={32} className="text-kawaii-yellow-dark opacity-50" />
            </div>
          )}
          <img
            src={campaign.image}
            alt={campaign.animalName}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Status Badge */}
          {getStatusBadge()}

          {/* Emergency Badge */}
          {campaign.isEmergency && !isCompleted && (
            <div className="absolute top-4 right-4 bg-red-100 border border-red-200 text-red-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
              <AlertTriangle size={12} />
              Emergency
            </div>
          )}

          {/* Vet Verified Badge */}
          {campaign.isVetVerified && (
            <div className="absolute bottom-4 left-4 bg-blue-100 border border-blue-200 text-blue-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
              <Shield size={12} />
              Vet Verified
            </div>
          )}

          {/* Like Button */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="absolute bottom-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all duration-300 hover:scale-110 flex items-center justify-center"
          >
            <Heart 
              size={20} 
              className={`transition-colors duration-300 ${
                isLiked ? 'text-red-500 fill-red-500' : 'text-gray-600'
              }`} 
            />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col">
        <div className="space-y-3 flex-grow">
          
          {/* Name and Species */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Heart size={18} className="text-kawaii-yellow-dark" />
              {campaign.animalName}
            </h3>
            <span className="text-sm font-semibold text-gray-600 bg-kawaii-yellow/50 px-2 py-1 rounded-full capitalize">
              {campaign.species}
            </span>
          </div>

          {/* Medical Condition */}
          {campaign.medicalCondition && (
            <p className="text-sm text-gray-600 font-quicksand italic">
              Condition: {campaign.medicalCondition}
            </p>
          )}

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={16} className="text-kawaii-blue-dark flex-shrink-0" />
            <span className="font-quicksand text-sm">{campaign.location}</span>
          </div>

          {/* Days Left */}
          {!isCompleted && (
            <div className="flex items-center gap-2">
              <Clock size={16} className={`flex-shrink-0 ${daysLeftColor}`} />
              <span className={`font-quicksand text-sm ${daysLeftColor}`}>
                {campaign.daysLeft > 0 ? `${campaign.daysLeft} days left` : 'Last day!'}
              </span>
            </div>
          )}

          {/* Story */}
          <p className="text-gray-700 font-quicksand text-sm leading-relaxed line-clamp-3">
            {campaign.story}
          </p>

          {/* Shelter */}
          <p className="text-xs text-gray-500 font-quicksand">
            Organized by: {campaign.shelter}
          </p>
        </div>

        {/* Progress Section */}
        <div className="mt-6 space-y-4">
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">
                {formatCurrency(campaign.currentAmount)} raised
              </span>
              <span className="text-sm text-gray-600">
                of {formatCurrency(campaign.goalAmount)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  isCompleted ? 'bg-kawaii-green-dark' : 'bg-gradient-to-r from-kawaii-yellow to-kawaii-yellow-dark'
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{Math.round(progressPercentage)}% funded</span>
              <div className="flex items-center gap-1">
                <Users size={12} />
                <span>{campaign.donorCount} donors</span>
              </div>
            </div>
          </div>

          {/* Donate Button */}
          <button
            onClick={() => onDonate(campaign)}
            disabled={isCompleted}
            className={`w-full py-3 px-4 rounded-kawaii font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-md ${
              isCompleted
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : isFeatured
                ? 'bg-kawaii-yellow hover:bg-kawaii-yellow-dark text-gray-700 hover:scale-105 animate-pulse'
                : 'bg-kawaii-yellow hover:bg-kawaii-yellow-dark text-gray-700 hover:scale-105'
            }`}
          >
            <DollarSign size={18} />
            {isCompleted ? 'Campaign Complete' : 'Donate Now'}
          </button>
        </div>

        {/* Campaign Stats Toggle */}
        {showStats && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowFullStats(!showFullStats)}
              className="w-full py-2 px-4 bg-kawaii-blue/20 hover:bg-kawaii-blue/30 rounded-kawaii text-gray-700 font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <TrendingUp size={16} />
              {showFullStats ? 'Hide Campaign Stats' : 'Show Campaign Stats'}
            </button>
            
            {showFullStats && (
              <div className="mt-4">
                <DonationStats campaignId={campaign.id} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedCampaignCard;