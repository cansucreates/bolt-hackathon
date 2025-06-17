import React, { useState } from 'react';
import { Heart, MapPin, Calendar, Clock, AlertTriangle, Star } from 'lucide-react';
import { AdoptableAnimal } from '../../types/adoption';

interface AnimalCardProps {
  animal: AdoptableAnimal;
  onAdopt: (animal: AdoptableAnimal) => void;
}

const AnimalCard: React.FC<AnimalCardProps> = ({ animal, onAdopt }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const getAgeDisplay = () => {
    if (animal.age < 1) {
      return `${Math.round(animal.age * 12)} months`;
    }
    return `${animal.age} year${animal.age !== 1 ? 's' : ''}`;
  };

  const getWaitingTimeDisplay = () => {
    if (animal.waitingTime < 30) {
      return `${animal.waitingTime} days`;
    } else if (animal.waitingTime < 365) {
      return `${Math.round(animal.waitingTime / 30)} months`;
    } else {
      return `${Math.round(animal.waitingTime / 365)} year${Math.round(animal.waitingTime / 365) !== 1 ? 's' : ''}`;
    }
  };

  const getSpeciesEmoji = () => {
    switch (animal.species) {
      case 'dog': return '🐕';
      case 'cat': return '🐱';
      default: return '🐰';
    }
  };

  return (
    <div className="kawaii-pet-card group h-full flex flex-col bg-white/90 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-pink/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105">
      
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-t-kawaii">
        <div className="aspect-video bg-gray-200 relative">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-kawaii-pink/20 animate-pulse flex items-center justify-center">
              <Heart size={32} className="text-kawaii-pink-dark opacity-50" />
            </div>
          )}
          <img
            src={animal.photo}
            alt={animal.name}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {animal.isUrgent && (
              <div className="bg-red-100 border border-red-200 text-red-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                <AlertTriangle size={12} />
                Urgent
              </div>
            )}
            {animal.specialNeeds && (
              <div className="bg-purple-100 border border-purple-200 text-purple-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                <Star size={12} />
                Special Care
              </div>
            )}
          </div>

          {/* Like Button - Properly Centered */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all duration-300 hover:scale-110 flex items-center justify-center"
          >
            <Heart 
              size={20} 
              className={`transition-colors duration-300 ${
                isLiked ? 'text-red-500 fill-red-500' : 'text-gray-600'
              }`} 
            />
          </button>

          {/* Species Badge */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-700 shadow-sm">
            {getSpeciesEmoji()} {animal.species.charAt(0).toUpperCase() + animal.species.slice(1)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col">
        <div className="space-y-3 flex-grow">
          
          {/* Name and Age */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Heart size={18} className="text-kawaii-pink-dark" />
              {animal.name}
            </h3>
            <span className="text-sm font-semibold text-gray-600 bg-kawaii-yellow/50 px-2 py-1 rounded-full">
              {getAgeDisplay()}
            </span>
          </div>

          {/* Breed */}
          <p className="text-gray-600 font-quicksand font-semibold">{animal.breed}</p>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={16} className="text-kawaii-blue-dark flex-shrink-0" />
            <span className="font-quicksand text-sm">{animal.location}</span>
          </div>

          {/* Waiting Time */}
          <div className="flex items-center gap-2 text-gray-600">
            <Clock size={16} className="text-kawaii-purple-dark flex-shrink-0" />
            <span className="font-quicksand text-sm">
              Waiting for {getWaitingTimeDisplay()}
            </span>
          </div>

          {/* Story */}
          <p className="text-gray-700 font-quicksand text-sm leading-relaxed line-clamp-3">
            {animal.story}
          </p>

          {/* Shelter */}
          <p className="text-xs text-gray-500 font-quicksand">
            Available at: {animal.shelter}
          </p>
        </div>

        {/* Adopt Button */}
        <div className="mt-6">
          <button
            onClick={() => onAdopt(animal)}
            className="w-full py-3 px-4 bg-kawaii-pink hover:bg-kawaii-pink-dark text-gray-700 font-bold rounded-kawaii transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-md"
          >
            <Heart size={18} />
            Adopt {animal.name}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimalCard;