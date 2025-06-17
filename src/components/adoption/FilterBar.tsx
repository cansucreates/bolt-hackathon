import React from 'react';
import { Filter, MapPin, Calendar, Heart } from 'lucide-react';
import { AdoptionFilters } from '../../types/adoption';

interface FilterBarProps {
  filters: AdoptionFilters;
  onFilterChange: (filters: AdoptionFilters) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  const handleFilterUpdate = (key: keyof AdoptionFilters, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 mb-8">
      <div className="bg-white/80 backdrop-blur-md rounded-kawaii shadow-kawaii border-2 border-kawaii-pink/30 p-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Filter Title */}
          <div className="flex items-center gap-2 text-gray-700">
            <Filter size={20} className="text-kawaii-purple-dark" />
            <span className="font-quicksand font-bold text-lg">Find Your Perfect Match</span>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            
            {/* Species Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <label className="text-sm font-semibold text-gray-700 font-quicksand">Pet Type:</label>
              <div className="flex bg-white/60 rounded-kawaii p-1 shadow-sm border border-kawaii-pink/30">
                <button
                  onClick={() => handleFilterUpdate('species', 'all')}
                  className={`px-4 py-2 rounded-kawaii text-sm font-bold transition-all duration-300 ${
                    filters.species === 'all'
                      ? 'bg-kawaii-purple text-gray-700 shadow-md scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-kawaii-purple/30'
                  }`}
                >
                  All Pets
                </button>
                <button
                  onClick={() => handleFilterUpdate('species', 'dog')}
                  className={`px-4 py-2 rounded-kawaii text-sm font-bold transition-all duration-300 ${
                    filters.species === 'dog'
                      ? 'bg-kawaii-blue text-gray-700 shadow-md scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-kawaii-blue/30'
                  }`}
                >
                  🐕 Dogs
                </button>
                <button
                  onClick={() => handleFilterUpdate('species', 'cat')}
                  className={`px-4 py-2 rounded-kawaii text-sm font-bold transition-all duration-300 ${
                    filters.species === 'cat'
                      ? 'bg-kawaii-pink text-gray-700 shadow-md scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-kawaii-pink/30'
                  }`}
                >
                  🐱 Cats
                </button>
                <button
                  onClick={() => handleFilterUpdate('species', 'other')}
                  className={`px-4 py-2 rounded-kawaii text-sm font-bold transition-all duration-300 ${
                    filters.species === 'other'
                      ? 'bg-kawaii-green text-gray-700 shadow-md scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-kawaii-green/30'
                  }`}
                >
                  🐰 Other
                </button>
              </div>
            </div>

            {/* Age Range Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <label className="text-sm font-semibold text-gray-700 font-quicksand">Age:</label>
              <select
                value={filters.ageRange}
                onChange={(e) => handleFilterUpdate('ageRange', e.target.value)}
                className="kawaii-input text-sm py-2 px-4 min-w-[120px]"
              >
                <option value="all">All Ages</option>
                <option value="puppy">Puppy/Kitten</option>
                <option value="young">Young (1-3 years)</option>
                <option value="adult">Adult (3-7 years)</option>
                <option value="senior">Senior (7+ years)</option>
              </select>
            </div>

            {/* Location Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <label className="text-sm font-semibold text-gray-700 font-quicksand">Location:</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="text"
                  placeholder="City or ZIP code"
                  value={filters.location}
                  onChange={(e) => handleFilterUpdate('location', e.target.value)}
                  className="kawaii-input text-sm py-2 pl-10 pr-4 min-w-[150px]"
                />
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <label className="text-sm font-semibold text-gray-700 font-quicksand">Sort by:</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterUpdate('sort', e.target.value)}
                  className="kawaii-input text-sm py-2 pl-10 pr-4 min-w-[140px]"
                >
                  <option value="recent">Recently Added</option>
                  <option value="waiting">Longest Waiting</option>
                  <option value="urgent">Urgent Cases</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;