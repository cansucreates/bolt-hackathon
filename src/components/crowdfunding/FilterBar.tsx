import React from 'react';
import { Filter, MapPin, Shield, AlertTriangle, X } from 'lucide-react';
import { CrowdfundingFilters } from '../../types/crowdfunding';

interface FilterBarProps {
  filters: CrowdfundingFilters;
  onFilterChange: (filters: CrowdfundingFilters) => void;
  isSticky?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange, isSticky = true }) => {
  const handleFilterUpdate = (key: keyof CrowdfundingFilters, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearAllFilters = () => {
    onFilterChange({
      animalType: 'all',
      location: '',
      emergency: false,
      vetVerified: false,
      status: 'all',
      sort: 'newest'
    });
  };

  const hasActiveFilters = 
    filters.animalType !== 'all' ||
    filters.location !== '' ||
    filters.emergency ||
    filters.vetVerified ||
    filters.status !== 'all';

  const containerClasses = `
    max-w-6xl mx-auto px-4 mb-8 z-30
    ${isSticky ? 'sticky top-32' : ''}
  `;

  return (
    <div className={containerClasses}>
      <div className="bg-white/80 backdrop-blur-md rounded-kawaii shadow-kawaii border-2 border-kawaii-yellow/30 p-4 sm:p-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-gray-700">
            <Filter size={18} className="text-kawaii-purple-dark flex-shrink-0" />
            <span className="font-quicksand font-bold text-base sm:text-lg">Find Campaigns to Support</span>
          </div>
          
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-kawaii transition-all duration-300 flex items-center gap-2 text-sm"
            >
              <X size={14} />
              Clear All
            </button>
          )}
        </div>

        {/* Filter Controls - Improved Spacing */}
        <div className="space-y-4 lg:space-y-6">
          
          {/* Row 1: Animal Type and Location */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            
            {/* Animal Type Filter */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 font-quicksand mb-3">Animal Type:</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleFilterUpdate('animalType', 'all')}
                  className={`px-3 py-2 rounded-kawaii text-sm font-bold transition-all duration-300 min-h-[40px] ${
                    filters.animalType === 'all'
                      ? 'bg-kawaii-purple text-gray-700 shadow-md scale-105'
                      : 'bg-white/60 text-gray-600 hover:text-gray-800 hover:bg-kawaii-purple/30'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => handleFilterUpdate('animalType', 'dog')}
                  className={`px-3 py-2 rounded-kawaii text-sm font-bold transition-all duration-300 min-h-[40px] ${
                    filters.animalType === 'dog'
                      ? 'bg-kawaii-blue text-gray-700 shadow-md scale-105'
                      : 'bg-white/60 text-gray-600 hover:text-gray-800 hover:bg-kawaii-blue/30'
                  }`}
                >
                  🐕 Dogs
                </button>
                <button
                  onClick={() => handleFilterUpdate('animalType', 'cat')}
                  className={`px-3 py-2 rounded-kawaii text-sm font-bold transition-all duration-300 min-h-[40px] ${
                    filters.animalType === 'cat'
                      ? 'bg-kawaii-pink text-gray-700 shadow-md scale-105'
                      : 'bg-white/60 text-gray-600 hover:text-gray-800 hover:bg-kawaii-pink/30'
                  }`}
                >
                  🐱 Cats
                </button>
                <button
                  onClick={() => handleFilterUpdate('animalType', 'other')}
                  className={`px-3 py-2 rounded-kawaii text-sm font-bold transition-all duration-300 min-h-[40px] ${
                    filters.animalType === 'other'
                      ? 'bg-kawaii-green text-gray-700 shadow-md scale-105'
                      : 'bg-white/60 text-gray-600 hover:text-gray-800 hover:bg-kawaii-green/30'
                  }`}
                >
                  🐰 Other
                </button>
              </div>
            </div>

            {/* Location Filter */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 font-quicksand mb-3">Location:</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="text"
                  placeholder="City or ZIP code"
                  value={filters.location}
                  onChange={(e) => handleFilterUpdate('location', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-kawaii-pink rounded-kawaii bg-white/70 focus:outline-none focus:ring-2 focus:ring-kawaii-purple focus:border-transparent transition-all duration-300 text-sm min-h-[44px]"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Toggle Filters and Sort */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            
            {/* Toggle Filters */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 font-quicksand mb-3">Special Filters:</label>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleFilterUpdate('emergency', !filters.emergency)}
                  className={`px-4 py-2 rounded-kawaii text-sm font-bold transition-all duration-300 flex items-center gap-2 min-h-[40px] ${
                    filters.emergency
                      ? 'bg-red-100 text-red-700 shadow-md scale-105 border-2 border-red-200'
                      : 'bg-white/60 text-gray-600 hover:bg-red-50 border-2 border-gray-200'
                  }`}
                >
                  <AlertTriangle size={14} />
                  Emergency
                </button>
                <button
                  onClick={() => handleFilterUpdate('vetVerified', !filters.vetVerified)}
                  className={`px-4 py-2 rounded-kawaii text-sm font-bold transition-all duration-300 flex items-center gap-2 min-h-[40px] ${
                    filters.vetVerified
                      ? 'bg-blue-100 text-blue-700 shadow-md scale-105 border-2 border-blue-200'
                      : 'bg-white/60 text-gray-600 hover:bg-blue-50 border-2 border-gray-200'
                  }`}
                >
                  <Shield size={14} />
                  Vet Verified
                </button>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex-1 lg:max-w-xs">
              <label className="block text-sm font-semibold text-gray-700 font-quicksand mb-3">Sort by:</label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterUpdate('sort', e.target.value)}
                className="w-full py-3 px-4 border-2 border-kawaii-pink rounded-kawaii bg-white/70 focus:outline-none focus:ring-2 focus:ring-kawaii-purple focus:border-transparent transition-all duration-300 text-sm min-h-[44px]"
              >
                <option value="newest">Newest Campaigns</option>
                <option value="urgent">Most Urgent</option>
                <option value="progress">Most Progress</option>
                <option value="amount">Highest Goal</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;