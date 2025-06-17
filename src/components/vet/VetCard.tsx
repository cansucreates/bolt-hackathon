import React, { useState } from 'react';
import { Star, MapPin, Clock, Phone, Mail, Globe, Calendar, MessageCircle, Navigation, Heart, Stethoscope, Shield } from 'lucide-react';
import { VetService } from '../../types/vet';

interface VetCardProps {
  vet: VetService;
  onContact: (vet: VetService) => void;
  onBookAppointment: (vet: VetService) => void;
  onGetDirections: (vet: VetService) => void;
}

const VetCard: React.FC<VetCardProps> = ({ vet, onContact, onBookAppointment, onGetDirections }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const getAvailabilityText = () => {
    if (vet.availableHours.isOpen24h) {
      return 'Open 24/7';
    }
    if (vet.availableHours.isAvailableNow) {
      return `Open until ${vet.availableHours.close}`;
    }
    return `Opens at ${vet.availableHours.open}`;
  };

  const getAvailabilityColor = () => {
    if (vet.availableHours.isOpen24h || vet.availableHours.isAvailableNow) {
      return 'text-green-600';
    }
    return 'text-gray-500';
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-blue/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 h-full flex flex-col">
      
      {/* Header with Profile Picture and Basic Info */}
      <div className="p-6 border-b border-kawaii-blue/20">
        <div className="flex items-start gap-4">
          
          {/* Profile Picture */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
              {!imageLoaded && (
                <div className="w-full h-full bg-kawaii-blue/20 animate-pulse flex items-center justify-center">
                  <Stethoscope size={24} className="text-kawaii-blue-dark opacity-50" />
                </div>
              )}
              <img
                src={vet.profilePicture}
                alt={vet.name}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            </div>
            
            {/* Type Badge */}
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${
              vet.type === 'professional' ? 'bg-kawaii-blue-dark' : 'bg-kawaii-green-dark'
            }`}>
              {vet.type === 'professional' ? (
                <Shield size={12} className="text-white" />
              ) : (
                <Heart size={12} className="text-white" />
              )}
            </div>
          </div>

          {/* Name and Credentials */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800 truncate">{vet.name}</h3>
                <p className="text-sm text-gray-600 font-quicksand">{vet.credentials}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    vet.type === 'professional' 
                      ? 'bg-kawaii-blue text-gray-700' 
                      : 'bg-kawaii-green text-gray-700'
                  }`}>
                    {vet.type === 'professional' ? 'Professional' : 'Volunteer'}
                  </span>
                  {vet.isEmergency && (
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-100 text-red-700">
                      Emergency
                    </span>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 bg-kawaii-yellow/50 px-2 py-1 rounded-full">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-bold">{vet.rating}</span>
                <span className="text-xs text-gray-500">({vet.reviewCount})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-6 flex-grow">
        <div className="space-y-3">
          
          {/* Location and Distance */}
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={16} className="text-kawaii-blue-dark flex-shrink-0" />
            <span className="font-quicksand text-sm flex-1 truncate">{vet.location}</span>
            <div className="flex items-center gap-1 text-sm font-semibold">
              <Navigation size={14} />
              <span>{vet.distance}km</span>
            </div>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2 text-gray-600">
            <Clock size={16} className={`flex-shrink-0 ${getAvailabilityColor()}`} />
            <span className={`font-quicksand text-sm ${getAvailabilityColor()}`}>
              {getAvailabilityText()}
            </span>
            {vet.acceptsWalkIns && (
              <span className="text-xs bg-kawaii-green/50 text-gray-700 px-2 py-1 rounded-full font-semibold">
                Walk-ins OK
              </span>
            )}
          </div>

          {/* Specializations */}
          {vet.specializations.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Specializations:</p>
              <div className="flex flex-wrap gap-1">
                {vet.specializations.slice(0, 3).map((spec, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-kawaii-purple/30 text-gray-700 px-2 py-1 rounded-full"
                  >
                    {spec}
                  </span>
                ))}
                {vet.specializations.length > 3 && (
                  <span className="text-xs text-gray-500 px-2 py-1">
                    +{vet.specializations.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Services */}
          {vet.services.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Services:</p>
              <div className="flex flex-wrap gap-1">
                {vet.services.slice(0, 4).map((service, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-kawaii-pink/30 text-gray-700 px-2 py-1 rounded-full"
                  >
                    {service}
                  </span>
                ))}
                {vet.services.length > 4 && (
                  <span className="text-xs text-gray-500 px-2 py-1">
                    +{vet.services.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <p className="text-gray-700 font-quicksand text-sm leading-relaxed line-clamp-3">
            {vet.description}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 pt-0 space-y-3">
        
        {/* Primary Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onContact(vet)}
            className="bg-kawaii-blue hover:bg-kawaii-blue-dark text-gray-700 font-bold py-3 px-4 rounded-kawaii transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-md"
          >
            <MessageCircle size={16} />
            Contact
          </button>
          
          <button
            onClick={() => onBookAppointment(vet)}
            className="bg-kawaii-green hover:bg-kawaii-green-dark text-gray-700 font-bold py-3 px-4 rounded-kawaii transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-md"
          >
            <Calendar size={16} />
            Book
          </button>
        </div>

        {/* Secondary Action */}
        <button
          onClick={() => onGetDirections(vet)}
          className="w-full bg-white/60 hover:bg-white text-gray-700 font-bold py-2 px-4 rounded-kawaii transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 border border-kawaii-blue/30"
        >
          <Navigation size={16} />
          Get Directions
        </button>

        {/* Contact Info */}
        <div className="pt-2 border-t border-kawaii-blue/20">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Phone size={12} />
              <span>{vet.contactInfo.phone}</span>
            </div>
            {vet.contactInfo.website && (
              <div className="flex items-center gap-1">
                <Globe size={12} />
                <span>Website</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VetCard;