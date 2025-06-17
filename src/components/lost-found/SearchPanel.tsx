import React, { useState } from 'react';
import { Search, MapPin, Upload, Heart, PawPrint } from 'lucide-react';
import { SearchFilters } from '../../types/pet';

interface SearchPanelProps {
  onSearch: (filters: SearchFilters) => void;
  onReportPet: (type: 'lost' | 'found') => void;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ onSearch, onReportPet }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    status: 'all',
    location: ''
  });

  const [reportType, setReportType] = useState<'lost' | 'found'>('lost');

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const handleSearchClick = () => {
    onSearch(filters);
  };

  const handleSubmitReport = () => {
    onReportPet(reportType);
  };

  return (
    <div className="sticky top-32 z-30 mx-4 mb-12">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/80 backdrop-blur-md rounded-kawaii shadow-kawaii border-2 border-kawaii-pink/30 p-8">
          {/* Main Search Section - Equal Width Columns */}
          <div className="flex flex-col lg:flex-row gap-8 min-h-[400px]">
            {/* Search for Pets Column */}
            <div className="flex-1 flex flex-col">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Search className="text-kawaii-blue-dark" />
                Search for Pets
              </h3>
              
              {/* AI Image Search Upload Area */}
              <div className="mb-6 flex-shrink-0">
                <div className="border-2 border-dashed border-kawaii-blue rounded-kawaii p-8 text-center bg-kawaii-blue/10 hover:bg-kawaii-blue/20 transition-colors duration-300 cursor-pointer">
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <Upload size={48} className="text-kawaii-blue-dark" />
                    </div>
                    <div>
                      <p className="text-gray-700 font-quicksand font-semibold mb-2">
                        Drop or click to upload pet photo
                      </p>
                      <p className="text-sm text-gray-600">
                        AI-powered image search to find similar pets
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      Supported formats: JPG, PNG, WEBP (max 10MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Standard Search Filters */}
              <div className="space-y-4 flex-grow">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="text"
                    placeholder="Search by name, breed, or description..."
                    value={filters.query}
                    onChange={(e) => handleFilterChange('query', e.target.value)}
                    className="kawaii-input pl-12 w-full"
                  />
                </div>

                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="text"
                    placeholder="Location (city, neighborhood...)"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="kawaii-input pl-12 w-full"
                  />
                </div>

                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="kawaii-input w-full"
                >
                  <option value="all">All Pets</option>
                  <option value="lost">Lost Pets</option>
                  <option value="found">Found Pets</option>
                </select>

                {/* Search Button */}
                <button
                  onClick={handleSearchClick}
                  className="kawaii-button bg-kawaii-blue hover:bg-kawaii-blue-dark text-gray-700 font-bold py-4 px-6 w-full flex items-center justify-center gap-2"
                >
                  <Search size={20} />
                  Search Pets
                </button>
              </div>
            </div>

            {/* Report a Pet Column */}
            <div className="flex-1 flex flex-col">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Heart className="text-kawaii-pink-dark" />
                Report a Pet
              </h3>

              {/* Report Form matching height */}
              <div className="flex flex-col h-full space-y-6">
                {/* Pet Type Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    What type of report?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center p-4 border-2 rounded-kawaii hover:bg-kawaii-coral/10 transition-colors duration-300 cursor-pointer ${
                      reportType === 'lost' 
                        ? 'border-kawaii-coral bg-kawaii-coral/20' 
                        : 'border-kawaii-coral/60'
                    }`}>
                      <input 
                        type="radio" 
                        name="reportType" 
                        value="lost" 
                        checked={reportType === 'lost'}
                        onChange={(e) => setReportType(e.target.value as 'lost' | 'found')}
                        className="mr-3" 
                      />
                      <div className="flex items-center gap-2">
                        <PawPrint size={18} className="text-kawaii-coral" />
                        <span className="font-quicksand">Lost Pet</span>
                      </div>
                    </label>
                    <label className={`flex items-center p-4 border-2 rounded-kawaii hover:bg-kawaii-green/10 transition-colors duration-300 cursor-pointer ${
                      reportType === 'found' 
                        ? 'border-kawaii-green-dark bg-kawaii-green/20' 
                        : 'border-kawaii-green-dark'
                    }`}>
                      <input 
                        type="radio" 
                        name="reportType" 
                        value="found" 
                        checked={reportType === 'found'}
                        onChange={(e) => setReportType(e.target.value as 'lost' | 'found')}
                        className="mr-3" 
                      />
                      <div className="flex items-center gap-2">
                        <Heart size={18} className="text-kawaii-green-dark" />
                        <span className="font-quicksand">Found Pet</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Quick Info Fields */}
                <div className="space-y-4 flex-grow">
                  <input
                    type="text"
                    placeholder="Pet name (if known)"
                    className="kawaii-input w-full"
                  />
                  
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                    <input
                      type="text"
                      placeholder="Location where lost/found"
                      className="kawaii-input pl-12 w-full"
                    />
                  </div>

                  <textarea
                    placeholder="Brief description of the pet..."
                    className="kawaii-input w-full h-24 resize-none"
                  />

                  <input
                    type="email"
                    placeholder="Your contact email"
                    className="kawaii-input w-full"
                  />
                </div>

                {/* Single Submit Report Button */}
                <div className="mt-auto">
                  <button
                    onClick={handleSubmitReport}
                    className={`kawaii-button font-bold py-4 px-6 rounded-kawaii shadow-kawaii transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 w-full ${
                      reportType === 'lost'
                        ? 'bg-kawaii-coral hover:bg-kawaii-coral/80 text-gray-700'
                        : 'bg-kawaii-green hover:bg-kawaii-green-dark text-gray-700'
                    }`}
                  >
                    {reportType === 'lost' ? (
                      <>
                        <PawPrint size={20} />
                        Submit Lost Pet Report
                      </>
                    ) : (
                      <>
                        <Heart size={20} />
                        Submit Found Pet Report
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;