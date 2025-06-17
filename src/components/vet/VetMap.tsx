import React, { useState } from 'react';
import { MapPin, Loader, Stethoscope, Heart, Star, Clock, Navigation } from 'lucide-react';
import { VetService } from '../../types/vet';

interface VetMapProps {
  vets: VetService[];
  loading?: boolean;
  onVetSelect?: (vet: VetService) => void;
  selectedVet?: VetService | null;
}

interface MapPin {
  id: string;
  lat: number;
  lng: number;
  vet: VetService;
}

const VetMap: React.FC<VetMapProps> = ({ vets, loading = false, onVetSelect, selectedVet }) => {
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  const mapPins: MapPin[] = vets.map((vet) => ({
    id: vet.id,
    lat: vet.coordinates.lat,
    lng: vet.coordinates.lng,
    vet
  }));

  const handlePinClick = (pin: MapPin) => {
    onVetSelect?.(pin.vet);
  };

  if (loading) {
    return (
      <div className="h-full bg-white/80 backdrop-blur-md rounded-kawaii shadow-kawaii border-2 border-kawaii-blue/30 overflow-hidden">
        <div className="h-full bg-gradient-to-br from-kawaii-blue/20 to-kawaii-purple/20 flex items-center justify-center">
          <div className="text-center">
            <Loader size={48} className="text-kawaii-blue-dark animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-quicksand font-semibold">Loading veterinarians...</p>
            <p className="text-sm text-gray-500 font-quicksand mt-2">Finding the best care near you</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white/80 backdrop-blur-md rounded-kawaii shadow-kawaii border-2 border-kawaii-blue/30 overflow-hidden flex flex-col">
      
      {/* Map Header */}
      <div className="p-4 bg-kawaii-blue/20 border-b border-kawaii-blue/30 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-kawaii-blue-dark" />
            <h3 className="font-bold text-gray-800 font-quicksand">Veterinarian Locations</h3>
          </div>
          <div className="text-sm text-gray-600 font-quicksand">
            {vets.length} vets found
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div 
        className="relative flex-1 bg-gradient-to-br from-kawaii-green/10 via-kawaii-blue/10 to-kawaii-purple/10 overflow-hidden"
        role="img"
        aria-label={`Interactive map showing ${vets.length} veterinarian locations`}
      >
        
        {/* Map Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="vet-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#B6E6FF" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#vet-grid)" />
          </svg>
        </div>

        {/* Current Location Marker */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-5">
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse">
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
          </div>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 font-quicksand whitespace-nowrap">
            Your Location
          </div>
        </div>

        {/* Vet Pins */}
        {mapPins.map((pin) => {
          const x = ((pin.lng + 180) / 360) * 100;
          const y = ((90 - pin.lat) / 180) * 100;
          const isSelected = selectedVet?.id === pin.vet.id;
          
          return (
            <div
              key={pin.id}
              className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-all duration-300 hover:scale-110 z-10"
              style={{ 
                left: `${Math.max(5, Math.min(95, x))}%`, 
                top: `${Math.max(5, Math.min(95, y))}%` 
              }}
              onClick={() => handlePinClick(pin)}
              onMouseEnter={() => setHoveredPin(pin.id)}
              onMouseLeave={() => setHoveredPin(null)}
              role="button"
              tabIndex={0}
              aria-label={`${pin.vet.type} veterinarian: ${pin.vet.name} - ${pin.vet.distance}km away`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handlePinClick(pin);
                }
              }}
            >
              {/* Pin Shadow */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-black/20 rounded-full blur-sm"></div>
              
              {/* Pin */}
              <div className={`relative w-8 h-10 transition-all duration-300 ${
                hoveredPin === pin.id || isSelected ? 'scale-125' : ''
              }`}>
                <div className={`w-full h-full rounded-t-full border-2 border-white shadow-lg flex items-center justify-center ${
                  pin.vet.type === 'professional' 
                    ? 'bg-kawaii-blue-dark' 
                    : 'bg-kawaii-green-dark'
                } ${isSelected ? 'ring-2 ring-kawaii-yellow' : ''}`}>
                  <Stethoscope size={16} className="text-white" />
                </div>
                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-transparent ${
                  pin.vet.type === 'professional' 
                    ? 'border-t-kawaii-blue-dark' 
                    : 'border-t-kawaii-green-dark'
                }`}></div>
                
                {/* Emergency Badge */}
                {pin.vet.isEmergency && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                )}
              </div>

              {/* Hover Tooltip */}
              {hoveredPin === pin.id && (
                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-kawaii shadow-lg border border-kawaii-blue/30 p-3 min-w-56 z-20 animate-slide-in">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        pin.vet.type === 'professional' 
                          ? 'bg-kawaii-blue-dark text-white' 
                          : 'bg-kawaii-green-dark text-white'
                      }`}>
                        {pin.vet.type.toUpperCase()}
                      </span>
                      {pin.vet.isEmergency && (
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-100 text-red-700">
                          24/7
                        </span>
                      )}
                    </div>
                    
                    <h4 className="font-bold text-gray-800 text-sm mb-1">{pin.vet.name}</h4>
                    <p className="text-xs text-gray-600 mb-2">{pin.vet.credentials}</p>
                    
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Star size={12} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-semibold">{pin.vet.rating}</span>
                      <span className="text-xs text-gray-500">({pin.vet.reviewCount})</span>
                    </div>
                    
                    <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-2">
                      <Navigation size={12} />
                      <span>{pin.vet.distance}km away</span>
                    </div>

                    <div className="flex items-center justify-center gap-1 text-xs">
                      <Clock size={12} className={pin.vet.availableHours.isAvailableNow ? 'text-green-500' : 'text-gray-500'} />
                      <span className={pin.vet.availableHours.isAvailableNow ? 'text-green-600 font-semibold' : 'text-gray-500'}>
                        {pin.vet.availableHours.isAvailableNow ? 'Open Now' : 'Closed'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Tooltip Arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/95"></div>
                </div>
              )}
            </div>
          );
        })}

        {/* Legend */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-kawaii shadow-lg border border-kawaii-blue/30 p-4 z-20">
          <h4 className="font-bold text-gray-800 text-sm mb-3 font-quicksand">Map Legend</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-8 bg-kawaii-blue-dark rounded-t-full border-2 border-white shadow-sm flex items-center justify-center relative">
                <Stethoscope size={12} className="text-white" />
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-kawaii-blue-dark"></div>
              </div>
              <span className="text-xs text-gray-700 font-quicksand">Professional Vet</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-8 bg-kawaii-green-dark rounded-t-full border-2 border-white shadow-sm flex items-center justify-center relative">
                <Heart size={12} className="text-white" />
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-kawaii-green-dark"></div>
              </div>
              <span className="text-xs text-gray-700 font-quicksand">Volunteer Vet</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
              <span className="text-xs text-gray-700 font-quicksand">Your Location</span>
            </div>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-20">
          <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-kawaii shadow-lg border border-kawaii-blue/30 flex items-center justify-center text-gray-700 hover:bg-white transition-colors duration-200">
            +
          </button>
          <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-kawaii shadow-lg border border-kawaii-blue/30 flex items-center justify-center text-gray-700 hover:bg-white transition-colors duration-200">
            −
          </button>
        </div>
      </div>
    </div>
  );
};

export default VetMap;