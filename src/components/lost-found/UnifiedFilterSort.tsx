import React from 'react';
import { PawPrint, Heart, Search, ArrowUpDown, Clock, MapPin, Calendar } from 'lucide-react';

type ActiveSection = 'all' | 'lost' | 'found';
type SortOption = 'newest' | 'oldest' | 'nearest';

interface UnifiedFilterSortProps {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  lostCount: number;
  foundCount: number;
  totalResults: number;
}

const UnifiedFilterSort: React.FC<UnifiedFilterSortProps> = ({ 
  activeSection, 
  onSectionChange, 
  sortBy,
  onSortChange,
  lostCount, 
  foundCount,
  totalResults
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 mb-8">
      <div className="bg-white/70 backdrop-blur-sm rounded-kawaii shadow-kawaii border border-kawaii-pink/20 p-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Filter Section */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <ArrowUpDown size={18} className="text-kawaii-blue-dark" />
              <span className="font-quicksand font-semibold">
                <strong>{totalResults}</strong> pets found
              </span>
            </div>
            
            {/* Category Filter Buttons */}
            <div className="flex bg-white/60 rounded-kawaii p-1 shadow-sm border border-kawaii-pink/30">
              <button
                onClick={() => onSectionChange('all')}
                className={`flex items-center gap-2 px-4 py-2 rounded-kawaii font-bold transition-all duration-300 text-sm ${
                  activeSection === 'all'
                    ? 'bg-kawaii-purple text-gray-700 shadow-md scale-105'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-kawaii-purple/30'
                }`}
              >
                <Search size={16} />
                <span>All</span>
                <span className="bg-white/70 px-2 py-1 rounded-full text-xs font-bold">
                  {lostCount + foundCount}
                </span>
              </button>

              <button
                onClick={() => onSectionChange('lost')}
                className={`flex items-center gap-2 px-4 py-2 rounded-kawaii font-bold transition-all duration-300 text-sm ${
                  activeSection === 'lost'
                    ? 'bg-kawaii-coral text-gray-700 shadow-md scale-105'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-kawaii-coral/30'
                }`}
              >
                <PawPrint size={16} />
                <span>Lost</span>
                <span className="bg-white/70 px-2 py-1 rounded-full text-xs font-bold">
                  {lostCount}
                </span>
              </button>

              <button
                onClick={() => onSectionChange('found')}
                className={`flex items-center gap-2 px-4 py-2 rounded-kawaii font-bold transition-all duration-300 text-sm ${
                  activeSection === 'found'
                    ? 'bg-kawaii-green-dark text-gray-700 shadow-md scale-105'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-kawaii-green/30'
                }`}
              >
                <Heart size={16} />
                <span>Found</span>
                <span className="bg-white/70 px-2 py-1 rounded-full text-xs font-bold">
                  {foundCount}
                </span>
              </button>
            </div>
          </div>

          {/* Sort Section */}
          <div className="flex items-center gap-4">
            <span className="text-gray-600 font-quicksand text-sm font-semibold">Sort by:</span>
            <div className="flex bg-white/60 rounded-kawaii p-1 shadow-sm border border-kawaii-blue/30">
              <button
                onClick={() => onSortChange('newest')}
                className={`flex items-center gap-1 px-3 py-2 rounded-kawaii text-sm font-bold transition-all duration-300 ${
                  sortBy === 'newest'
                    ? 'bg-kawaii-blue text-gray-700 shadow-sm scale-105'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-kawaii-blue/30'
                }`}
              >
                <Calendar size={14} />
                <span className="hidden sm:inline">Newest</span>
                <span className="sm:hidden">New</span>
              </button>
              
              <button
                onClick={() => onSortChange('oldest')}
                className={`flex items-center gap-1 px-3 py-2 rounded-kawaii text-sm font-bold transition-all duration-300 ${
                  sortBy === 'oldest'
                    ? 'bg-kawaii-blue text-gray-700 shadow-sm scale-105'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-kawaii-blue/30'
                }`}
              >
                <Clock size={14} />
                <span className="hidden sm:inline">Oldest</span>
                <span className="sm:hidden">Old</span>
              </button>
              
              <button
                onClick={() => onSortChange('nearest')}
                className={`flex items-center gap-1 px-3 py-2 rounded-kawaii text-sm font-bold transition-all duration-300 ${
                  sortBy === 'nearest'
                    ? 'bg-kawaii-blue text-gray-700 shadow-sm scale-105'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-kawaii-blue/30'
                }`}
              >
                <MapPin size={14} />
                <span className="hidden sm:inline">Nearest</span>
                <span className="sm:hidden">Near</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedFilterSort;