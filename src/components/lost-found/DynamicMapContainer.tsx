import React, { useState, useEffect } from 'react';
import { MapPin, Loader, Eye, Calendar, PawPrint, Heart, RefreshCw } from 'lucide-react';
import { PetReport } from '../../types/lostFound';

interface DynamicMapContainerProps {
  reports: PetReport[];
  loading: boolean;
  onReportSelect?: (report: PetReport) => void;
  selectedReport?: PetReport | null;
}

interface MapPin {
  id: string;
  lat: number;
  lng: number;
  report: PetReport;
}

const DynamicMapContainer: React.FC<DynamicMapContainerProps> = ({ 
  reports, 
  loading, 
  onReportSelect,
  selectedReport 
}) => {
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  const [mapPins, setMapPins] = useState<MapPin[]>([]);

  // Generate coordinates for reports (in a real app, these would be stored in the database)
  const generateCoordinatesForLocation = (location: string, index: number): { lat: number; lng: number } => {
    // Hash the location string to get consistent coordinates
    let hash = 0;
    for (let i = 0; i < location.length; i++) {
      const char = location.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Use hash to generate coordinates within reasonable bounds
    const latBase = 40.7128; // NYC area as base
    const lngBase = -74.0060;
    
    const latOffset = ((hash % 1000) / 1000 - 0.5) * 0.1; // ±0.05 degrees
    const lngOffset = (((hash >> 10) % 1000) / 1000 - 0.5) * 0.1;
    
    // Add small random offset based on index to avoid overlapping
    const indexOffset = (index * 0.001);
    
    return {
      lat: latBase + latOffset + indexOffset,
      lng: lngBase + lngOffset + indexOffset
    };
  };

  useEffect(() => {
    const pins: MapPin[] = reports.map((report, index) => ({
      id: report.id,
      ...generateCoordinatesForLocation(report.location, index),
      report
    }));
    setMapPins(pins);
  }, [reports]);

  const handlePinClick = (pin: MapPin) => {
    onReportSelect?.(pin.report);
  };

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
              <p className="text-sm text-gray-500 font-quicksand mt-2">Fetching reports from database...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 mb-12">
      <div className="bg-white/80 backdrop-blur-md rounded-kawaii shadow-kawaii border-2 border-kawaii-pink/30 overflow-hidden">
        
        {/* Map Header */}
        <div className="p-4 bg-kawaii-blue/20 border-b border-kawaii-blue/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-kawaii-blue-dark" />
              <h3 className="font-bold text-gray-800 font-quicksand">Live Pet Reports Map</h3>
              <div className="flex items-center gap-1 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold">LIVE</span>
              </div>
            </div>
            <div className="text-sm text-gray-600 font-quicksand">
              {reports.length} active reports
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div 
          className="relative h-96 md:h-[400px] bg-gradient-to-br from-kawaii-green/10 via-kawaii-blue/10 to-kawaii-purple/10 overflow-hidden"
          role="img"
          aria-label={`Interactive map showing ${reports.length} pet report locations`}
        >
          
          {/* Map Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#B6E6FF" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Map Pins */}
          {mapPins.map((pin) => {
            const x = ((pin.lng + 180) / 360) * 100;
            const y = ((90 - pin.lat) / 180) * 100;
            const isSelected = selectedReport?.id === pin.report.id;
            
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
                aria-label={`${pin.report.type} pet: ${pin.report.pet_name || 'Unknown'} in ${pin.report.location}`}
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
                    pin.report.type === 'lost' 
                      ? 'bg-kawaii-coral' 
                      : 'bg-kawaii-green-dark'
                  } ${isSelected ? 'ring-2 ring-kawaii-yellow' : ''}`}>
                    {pin.report.type === 'lost' ? (
                      <PawPrint size={16} className="text-gray-700" />
                    ) : (
                      <Heart size={16} className="text-gray-700" />
                    )}
                  </div>
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-transparent ${
                    pin.report.type === 'lost' 
                      ? 'border-t-kawaii-coral' 
                      : 'border-t-kawaii-green-dark'
                  }`}></div>
                </div>

                {/* Hover Tooltip */}
                {hoveredPin === pin.id && (
                  <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-kawaii shadow-lg border border-kawaii-pink/30 p-3 min-w-48 z-20 animate-slide-in">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        {pin.report.type === 'lost' ? (
                          <PawPrint size={14} className="text-kawaii-coral" />
                        ) : (
                          <Heart size={14} className="text-kawaii-green-dark" />
                        )}
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          pin.report.type === 'lost' 
                            ? 'bg-kawaii-coral text-gray-700' 
                            : 'bg-kawaii-green-dark text-gray-700'
                        }`}>
                          {pin.report.type.toUpperCase()}
                        </span>
                      </div>
                      
                      {pin.report.pet_name && (
                        <h4 className="font-bold text-gray-800 text-sm mb-1">{pin.report.pet_name}</h4>
                      )}
                      
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{pin.report.description}</p>
                      
                      <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                        <Calendar size={12} />
                        <span>{formatDate(pin.report.date_reported)}</span>
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
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-kawaii shadow-lg border border-kawaii-pink/30 p-4 z-20">
            <h4 className="font-bold text-gray-800 text-sm mb-3 font-quicksand">Map Legend</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-8 bg-kawaii-coral rounded-t-full border-2 border-white shadow-sm flex items-center justify-center relative">
                  <PawPrint size={12} className="text-gray-700" />
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

          {/* Empty State */}
          {reports.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">🗺️</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No reports to display</h3>
                <p className="text-gray-600 font-quicksand">
                  Be the first to report a lost or found pet!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Selected Report Info */}
        {selectedReport && (
          <div className="p-4 bg-kawaii-yellow/20 border-t border-kawaii-yellow/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  selectedReport.type === 'lost' 
                    ? 'bg-kawaii-coral' 
                    : 'bg-kawaii-green-dark'
                }`}>
                  {selectedReport.type === 'lost' ? (
                    <PawPrint size={20} className="text-gray-700" />
                  ) : (
                    <Heart size={20} className="text-gray-700" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">
                    {selectedReport.pet_name || `${selectedReport.type} Pet`}
                  </h4>
                  <p className="text-sm text-gray-600 font-quicksand">{selectedReport.location}</p>
                </div>
              </div>
              <button
                onClick={() => onReportSelect?.(null as any)}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                aria-label="Close selected report info"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicMapContainer;