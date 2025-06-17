import React, { useState } from 'react';
import { MapPin, Calendar, Phone, Mail, Heart, PawPrint } from 'lucide-react';
import { PetCard } from '../../types/pet';

interface PetCardProps {
  pet: PetCard;
}

const PetCardComponent: React.FC<PetCardProps> = ({ pet }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
  };

  return (
    <div className="kawaii-pet-card group h-full flex flex-col">
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-t-kawaii">
        <div className="aspect-video bg-gray-200 relative">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-kawaii-pink/20 animate-pulse flex items-center justify-center">
              <PawPrint size={32} className="text-kawaii-pink-dark opacity-50" />
            </div>
          )}
          <img
            src={pet.photo}
            alt={pet.name || 'Pet photo'}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Status Badge */}
          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1 ${
            pet.status === 'lost' 
              ? 'bg-kawaii-coral text-gray-700' 
              : 'bg-kawaii-green text-gray-700'
          }`}>
            {pet.status === 'lost' ? (
              <>
                <PawPrint size={14} />
                Lost
              </>
            ) : (
              <>
                <Heart size={14} />
                Found
              </>
            )}
          </div>
        </div>
      </div>

      {/* Info Bubble */}
      <div className="info-bubble p-6 flex-grow flex flex-col">
        <div className="space-y-3 flex-grow">
          {/* Name */}
          {pet.name && (
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Heart size={18} className="text-kawaii-pink-dark" />
              {pet.name}
            </h3>
          )}

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={16} className="text-kawaii-blue-dark flex-shrink-0" />
            <span className="font-quicksand text-sm">{pet.location}</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={16} className="text-kawaii-purple-dark flex-shrink-0" />
            <span className="font-quicksand text-sm">{formatDate(pet.date)}</span>
          </div>

          {/* Description */}
          <p className="text-gray-700 font-quicksand text-sm leading-relaxed line-clamp-3">
            {pet.description}
          </p>
        </div>

        {/* Contact Section - Always at bottom */}
        <div className="mt-6 space-y-3">
          {/* Contact Button - Full Width */}
          <button
            onClick={() => setShowContact(!showContact)}
            className={`w-full py-3 px-4 rounded-kawaii font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 ${
              pet.status === 'lost'
                ? 'bg-kawaii-coral hover:bg-kawaii-coral/80 text-gray-700'
                : 'bg-kawaii-green hover:bg-kawaii-green-dark text-gray-700'
            }`}
          >
            {pet.status === 'lost' ? (
              <>
                <Heart size={18} />
                I Found This Pet
              </>
            ) : (
              <>
                <Phone size={18} />
                Contact Finder
              </>
            )}
          </button>

          {/* Contact Info */}
          {showContact && pet.contactInfo && (
            <div className="p-4 bg-kawaii-yellow/30 rounded-kawaii border border-kawaii-yellow animate-slide-in">
              <div className="flex items-center gap-2 text-gray-700">
                <Mail size={16} className="text-kawaii-blue-dark flex-shrink-0" />
                <span className="font-quicksand text-sm break-all">{pet.contactInfo}</span>
              </div>
              <p className="text-xs text-gray-600 mt-2 font-quicksand">
                Please be respectful when contacting pet owners
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetCardComponent;