import React, { useState } from 'react';
import { Search, MapPin, Filter, Clock, Star, Stethoscope, Heart } from 'lucide-react';
import { VetFilters } from '../../types/vet';

interface VetSearchPanelProps {
  filters: VetFilters;
  onFilterChange: (filters: VetFilters) => void;
  onUseCurrentLocation: () => void;
}

const VetSearchPanel: React.FC<VetSearchPanelProps> = ({ 
  filters, 
  onFilterChange, 
  onUseCurrentLocation 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterUpdate = (key: keyof VetFilters, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const serviceTypes = [
    'All Services',
    'Emergency Care',
    'Routine Checkup',
    'Surgery',
    'Dental Care',
    'Vaccination',
    'Grooming',
    'Behavioral Consultation',
    'Exotic Pet Care',
    'House Calls'
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 mb-8">
      <div className="bg-white/80 backdrop-blur-md rounded-kawaii shadow-kawaii border-2 border-kawaii-blue/30 p-6">
        
        {/* Main Search Row */}
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          
          {/* Location Search */}
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2 font-quicksand">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Enter city, address, or ZIP code"
                value={filters.location}
                onChange={(e) => handleFilterUpdate('location', e.target.value)}
                className="kawaii-input pl-12 w-full"
              />
              <button
                onClick={onUseCurrentLocation}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-kawaii-blue-dark hover:text-kawaii-blue text-sm font-semibold transition-colors duration-200"
              >
                Use Current
              </button>
            </div>
          </div>

          {/* Distance Radius */}
          <div className="lg:w-48">
            <label className="block text-sm font-semibold text-gray-700 mb-2 font-quicksand">
              Within
            </label>
            <select
              value={filters.radius}
              onChange={(e) => handleFilterUpdate('radius', Number(e.target.value))}
              className="kawaii-input w-full"
            >
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
              <option value={25}>25 km</option>
              <option value={50}>50 km</option>
              <option value={100}>100 km</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="lg:w-32 flex items-end">
            <button className="kawaii-button bg-kawaii-blue hover:bg-kawaii-blue-dark text-gray-700 font-bold py-3 px-6 w-full flex items-center justify-center gap-2">
              <Search size={18} />
              <span className="hidden lg:inline">Search</span>
            </button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => handleFilterUpdate('availableNow', !filters.availableNow)}
            className={`px-4 py-2 rounded-kawaii text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
              filters.availableNow
                ? 'bg-kawaii-green text-gray-700 shadow-md'
                : 'bg-white/60 text-gray-600 hover:bg-kawaii-green/30'
            }`}
          >
            <Clock size={16} />
            Available Now
          </button>

          <button
            onClick={() => handleFilterUpdate('emergency', !filters.emergency)}
            className={`px-4 py-2 rounded-kawaii text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
              filters.emergency
                ? 'bg-kawaii-coral text-gray-700 shadow-md'
                : 'bg-white/60 text-gray-600 hover:bg-kawaii-coral/30'
            }`}
          >
            <Heart size={16} />
            Emergency Only
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 rounded-kawaii text-sm font-bold bg-white/60 text-gray-600 hover:bg-kawaii-purple/30 transition-all duration-300 flex items-center gap-2"
          >
            <Filter size={16} />
            More Filters
            <span className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="border-t border-kawaii-blue/30 pt-4 space-y-4 animate-slide-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Vet Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-quicksand">
                  Veterinarian Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterUpdate('type', e.target.value)}
                  className="kawaii-input w-full text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="professional">Professional</option>
                  <option value="volunteer">Volunteer</option>
                </select>
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-quicksand">
                  Service Type
                </label>
                <select
                  value={filters.serviceType}
                  onChange={(e) => handleFilterUpdate('serviceType', e.target.value)}
                  className="kawaii-input w-full text-sm"
                >
                  {serviceTypes.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              {/* Minimum Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-quicksand">
                  Minimum Rating
                </label>
                <select
                  value={filters.minRating}
                  onChange={(e) => handleFilterUpdate('minRating', Number(e.target.value))}
                  className="kawaii-input w-full text-sm"
                >
                  <option value={0}>Any Rating</option>
                  <option value={3}>3+ Stars</option>
                  <option value={4}>4+ Stars</option>
                  <option value={4.5}>4.5+ Stars</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-quicksand">
                  Sort By
                </label>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterUpdate('sort', e.target.value)}
                  className="kawaii-input w-full text-sm"
                >
                  <option value="distance">Distance</option>
                  <option value="rating">Rating</option>
                  <option value="availability">Availability</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VetSearchPanel;