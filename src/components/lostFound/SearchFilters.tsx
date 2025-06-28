import React from 'react';
import { Search, MapPin, Calendar, Filter, X } from 'lucide-react';
import { ReportFilters } from '../../types/lostFound';

interface SearchFiltersProps {
  filters: ReportFilters;
  onFilterChange: (filters: ReportFilters) => void;
  onClear: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFilterChange, onClear }) => {
  const handleFilterUpdate = (key: keyof ReportFilters, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = 
    filters.type !== 'all' ||
    filters.status !== 'all' ||
    filters.location ||
    filters.searchQuery ||
    filters.dateRange;

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-kawaii shadow-kawaii border-2 border-kawaii-pink/30 p-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-gray-700">
          <Filter size={20} className="text-kawaii-purple-dark" />
          <span className="font-quicksand font-bold text-lg">Search & Filter Reports</span>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-kawaii transition-all duration-300 flex items-center gap-2 text-sm"
          >
            <X size={14} />
            Clear All
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search by pet name, description, or keywords..."
            value={filters.searchQuery || ''}
            onChange={(e) => handleFilterUpdate('searchQuery', e.target.value)}
            className="kawaii-input pl-12 w-full"
          />
        </div>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        {/* Type Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Report Type</label>
          <select
            value={filters.type || 'all'}
            onChange={(e) => handleFilterUpdate('type', e.target.value)}
            className="kawaii-input w-full text-sm"
          >
            <option value="all">All Reports</option>
            <option value="lost">Lost Pets</option>
            <option value="found">Found Pets</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
          <select
            value={filters.status || 'all'}
            onChange={(e) => handleFilterUpdate('status', e.target.value)}
            className="kawaii-input w-full text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="City, neighborhood..."
              value={filters.location || ''}
              onChange={(e) => handleFilterUpdate('location', e.target.value)}
              className="kawaii-input pl-10 w-full text-sm"
            />
          </div>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Date Range</label>
          <select
            value={filters.dateRange ? 'custom' : 'all'}
            onChange={(e) => {
              if (e.target.value === 'all') {
                handleFilterUpdate('dateRange', undefined);
              } else if (e.target.value === 'week') {
                const end = new Date().toISOString().split('T')[0];
                const start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                handleFilterUpdate('dateRange', { start, end });
              } else if (e.target.value === 'month') {
                const end = new Date().toISOString().split('T')[0];
                const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                handleFilterUpdate('dateRange', { start, end });
              }
            }}
            className="kawaii-input w-full text-sm"
          >
            <option value="all">All Time</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="border-t border-kawaii-pink/30 pt-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {filters.type && filters.type !== 'all' && (
              <span className="px-3 py-1 bg-kawaii-blue/30 text-kawaii-blue-dark rounded-kawaii text-sm font-semibold">
                Type: {filters.type}
              </span>
            )}
            {filters.status && filters.status !== 'all' && (
              <span className="px-3 py-1 bg-kawaii-green/30 text-kawaii-green-dark rounded-kawaii text-sm font-semibold">
                Status: {filters.status}
              </span>
            )}
            {filters.location && (
              <span className="px-3 py-1 bg-kawaii-purple/30 text-kawaii-purple-dark rounded-kawaii text-sm font-semibold">
                Location: {filters.location}
              </span>
            )}
            {filters.searchQuery && (
              <span className="px-3 py-1 bg-kawaii-yellow/30 text-kawaii-yellow-dark rounded-kawaii text-sm font-semibold">
                Search: "{filters.searchQuery}"
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;