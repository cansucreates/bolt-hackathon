import React, { useState, useEffect } from 'react';
import { MapPin, Loader, Eye, Calendar, PawPrint as Paw, Heart } from 'lucide-react';
import { PetCard } from '../../types/pet';

interface MapContainerProps {
  pets: PetCard[];
  onPetSelect?: (pet: PetCard) => void;
}

interface MapPin {
  id: string;
  lat: number;
  lng: number;
  pet: PetCard;
}

const MapContainer: React.FC<MapContainerProps> = ({ pets, onPetSelect }) => {
  const [loading, setLoading] = useState(true);
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  const [selectedPin, setSelectedPin] = useState<string | null>(null);

  // Generate coordinates based on location string
  const generateCoordinatesFromLocation = (location: string, index: number): { lat: number; lng: number } => {
    // Base coordinates for major cities/regions
    const locationCoords: { [key: string]: { lat: number; lng: number } } = {
      // US Cities
      'new york': { lat: 40.7128, lng: -74.0060 },
      'nyc': { lat: 40.7128, lng: -74.0060 },
      'manhattan': { lat: 40.7831, lng: -73.9712 },
      'brooklyn': { lat: 40.6782, lng: -73.9442 },
      'queens': { lat: 40.7282, lng: -73.7949 },
      'bronx': { lat: 40.8448, lng: -73.8648 },
      'boston': { lat: 42.3601, lng: -71.0589 },
      'chicago': { lat: 41.8781, lng: -87.6298 },
      'seattle': { lat: 47.6062, lng: -122.3321 },
      'san francisco': { lat: 37.7749, lng: -122.4194 },
      'los angeles': { lat: 34.0522, lng: -118.2437 },
      'miami': { lat: 25.7617, lng: -80.1918 },
      'austin': { lat: 30.2672, lng: -97.7431 },
      'denver': { lat: 39.7392, lng: -104.9903 },
      'phoenix': { lat: 33.4484, lng: -112.0740 },
      'nashville': { lat: 36.1627, lng: -86.7816 },
      'las vegas': { lat: 36.1699, lng: -115.1398 },
      'salt lake city': { lat: 40.7608, lng: -111.8910 },
      'albuquerque': { lat: 35.0844, lng: -106.6504 },
      'portland': { lat: 45.5152, lng: -122.6784 },
      'atlanta': { lat: 33.7490, lng: -84.3880 },
      'philadelphia': { lat: 39.9526, lng: -75.1652 },
      'dallas': { lat: 32.7767, lng: -96.7970 },
      'houston': { lat: 29.7604, lng: -95.3698 },
      
      // Parks and landmarks
      'central park': { lat: 40.7829, lng: -73.9654 },
      'golden gate park': { lat: 37.7694, lng: -122.4862 },
      'millennium park': { lat: 41.8826, lng: -87.6226 },
      'prospect park': { lat: 40.6602, lng: -73.9690 },
      
      // Generic regions
      'downtown': { lat: 40.7589, lng: -73.9851 },
      'uptown': { lat: 40.7831, lng: -73.9712 },
      'midtown': { lat: 40.7549, lng: -73.9840 },
      'suburbs': { lat: 40.7282, lng: -73.7949 }
    };

    const locationKey = location.toLowerCase();
    let baseCoords = { lat: 39.8283, lng: -98.5795 }; // Center of US as default

    // Find matching location
    for (const [key, coords] of Object.entries(locationCoords)) {
      if (locationKey.includes(key)) {
        baseCoords = coords;
        break;
      }
    }

    // Add small random offset to avoid overlapping pins (0.01 degrees ≈ 1km)
    const offset = 0.015;
    const randomOffset = () => (Math.random() - 0.5) * offset;
    
    return {
      lat: baseCoords.lat + randomOffset(),
      lng: baseCoords.lng + randomOffset()
    };
  };

  const mapPins: MapPin[] = pets.map((pet, index) => ({
    id: pet.id,
    ...generateCoordinatesFromLocation(pet.location, index),
    pet
  }));

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [pets]);

  const handlePinClick = (pin: MapPin) => {
    setSelectedPin(pin.id);
    onPetSelect?.(pin.pet);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 mb-12">
        <div className="bg-white/80 backdrop-blur-md rounded-kawaii shadow-kawaii border-2 border-kawaii-pink/30 overflow-hidden">
          <div className="h-96 md:h-[400px] bg-gradient-to-br from-kawaii-blue/20 to-kawaii-purple/20 flex items-center justify-center">
            <div className="text-center">
              <Loader size={48} className="text-kawaii-blue-dark animate-spin mx-auto mb-4" />
              <p className="text-gray-600 font-quicksand font-semibold">Loading pet locations...</p>
              <p className="text-sm text-gray-500 font-quicksand mt-2">Mapping {pets.length} pets in your area</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 mb-12">
      <div className="bg-white/80 backdrop-blur-md rounded-kawaii shadow-kawaii border-2 border-kawaii-pink/30 overflow-hidden">
        
        {/* Map Header - z-index 10 */}
        <div className="p-4 bg-kawaii-blue/20 border-b border-kawaii-blue/30 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-kawaii-blue-dark" />
              <h3 className="font-bold text-gray-800 font-quicksand">Pet Locations Map</h3>
            </div>
            <div className="text-sm text-gray-600 font-quicksand">
              {pets.length} pets shown
            </div>
          </div>
        </div>

        {/* Map Container - Position relative for proper stacking context */}
        <div 
          className="relative h-96 md:h-[400px] bg-gradient-to-br from-kawaii-green/10 via-kawaii-blue/10 to-kawaii-purple/10 overflow-hidden"
          role="img"
          aria-label={`Interactive map showing ${pets.length} pet locations`}
        >
          
          {/* Map Background Pattern - z-index 5 */}
          <div className="absolute inset-0 opacity-20 z-5">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#B6E6FF" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Map Pins - z-index 30 */}
          {mapPins.map((pin) => {
            const x = ((pin.lng + 180) / 360) * 100; // Convert lng to percentage
            const y = ((90 - pin.lat) / 180) * 100; // Convert lat to percentage (inverted)
            
            return (
              <div
                key={pin.id}
                className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-all duration-300 hover:scale-110 z-30"
                style={{ 
                  left: `${Math.max(5, Math.min(95, x))}%`, 
                  top: `${Math.max(5, Math.min(95, y))}%` 
                }}
                onClick={() => handlePinClick(pin)}
                onMouseEnter={() => setHoveredPin(pin.id)}
                onMouseLeave={() => setHoveredPin(null)}
                role="button"
                tabIndex={0}
                aria-label={`${pin.pet.status} pet: ${pin.pet.name || 'Unknown'} in ${pin.pet.location}`}
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
                  hoveredPin === pin.id || selectedPin === pin.id ? 'scale-125' : ''
                }`}>
                  <div className={`w-full h-full rounded-t-full border-2 border-white shadow-lg flex items-center justify-center ${
                    pin.pet.status === 'lost' 
                      ? 'bg-kawaii-coral' 
                      : 'bg-kawaii-green-dark'
                  }`}>
                    {pin.pet.status === 'lost' ? (
                      <Paw size={16} className="text-gray-700" />
                    ) : (
                      <Heart size={16} className="text-gray-700" />
                    )}
                  </div>
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-transparent ${
                    pin.pet.status === 'lost' 
                      ? 'border-t-kawaii-coral' 
                      : 'border-t-kawaii-green-dark'
                  }`}></div>
                </div>

                {/* Hover Tooltip - z-index 9999 (highest) */}
                {hoveredPin === pin.id && (
                  <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-kawaii shadow-lg border border-kawaii-pink/30 p-3 min-w-48 z-[9999] animate-slide-in">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        {pin.pet.status === 'lost' ? (
                          <Paw size={14} className="text-kawaii-coral" />
                        ) : (
                          <Heart size={14} className="text-kawaii-green-dark" />
                        )}
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          pin.pet.status === 'lost' 
                            ? 'bg-kawaii-coral text-gray-700' 
                            : 'bg-kawaii-green-dark text-gray-700'
                        }`}>
                          {pin.pet.status.toUpperCase()}
                        </span>
                      </div>
                      
                      {pin.pet.name && (
                        <h4 className="font-bold text-gray-800 text-sm mb-1">{pin.pet.name}</h4>
                      )}
                      
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{pin.pet.description}</p>
                      
                      <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                        <Calendar size={12} />
                        <span>{formatDate(pin.pet.date)}</span>
                      </div>
                    </div>
                    
                    {/* Tooltip Arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/95"></div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Legend - z-index 20 */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-kawaii shadow-lg border border-kawaii-pink/30 p-4 z-20">
            <h4 className="font-bold text-gray-800 text-sm mb-3 font-quicksand">Map Legend</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-8 bg-kawaii-coral rounded-t-full border-2 border-white shadow-sm flex items-center justify-center relative">
                  <Paw size={12} className="text-gray-700" />
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-kawaii-coral"></div>
                </div>
                <span className="text-xs text-gray-700 font-quicksand">Lost Pets</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-8 bg-kawaii-green-dark rounded-t-full border-2 border-white shadow-sm flex items-center justify-center relative">
                  <Heart size={12} className="text-gray-700" />
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-kawaii-green-dark"></div>
                </div>
                <span className="text-xs text-gray-700 font-quicksand">Found Pets</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-kawaii-pink/30">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Eye size={12} />
                <span>Click pins for details</span>
              </div>
            </div>
          </div>

          {/* Map Attribution - z-index 20 */}
          <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-white/70 px-2 py-1 rounded z-20">
            Interactive Pet Map
          </div>
        </div>

        {/* Selected Pet Info - z-index 10 */}
        {selectedPin && (
          <div className="p-4 bg-kawaii-yellow/20 border-t border-kawaii-yellow/30 relative z-10">
            {(() => {
              const selectedPet = mapPins.find(pin => pin.id === selectedPin)?.pet;
              if (!selectedPet) return null;
              
              return (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      selectedPet.status === 'lost' 
                        ? 'bg-kawaii-coral' 
                        : 'bg-kawaii-green-dark'
                    }`}>
                      {selectedPet.status === 'lost' ? (
                        <Paw size={20} className="text-gray-700" />
                      ) : (
                        <Heart size={20} className="text-gray-700" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">
                        {selectedPet.name || `${selectedPet.status} Pet`}
                      </h4>
                      <p className="text-sm text-gray-600 font-quicksand">{selectedPet.location}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPin(null)}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    aria-label="Close selected pet info"
                  >
                    ✕
                  </button>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapContainer;