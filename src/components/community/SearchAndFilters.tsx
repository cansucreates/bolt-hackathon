import React, { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import PostCreationButton from './PostCreationButton';

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  onCreatePost: () => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: { id: string; name: string }[];
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  onSearchChange,
  showFilters,
  onToggleFilters,
  onCreatePost,
  sortBy,
  onSortChange,
  selectedCategory,
  onCategoryChange,
  categories
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-purple/30 p-4 md:p-6 mb-6 md:mb-8">
      <div className="flex flex-col gap-4">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search discussions, topics, or users..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="kawaii-input pl-12 w-full"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onToggleFilters}
            className={`flex-1 sm:flex-none px-4 py-3 rounded-kawaii font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
              showFilters 
                ? 'bg-kawaii-purple text-gray-700 shadow-md' 
                : 'bg-white/60 text-gray-600 hover:bg-kawaii-purple/30'
            }`}
          >
            <Filter size={18} />
            Filters
          </button>
          
          <PostCreationButton onClick={onCreatePost} />
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="mt-6 pt-6 border-t border-kawaii-purple/30 animate-slide-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="kawaii-input w-full text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="kawaii-input w-full text-sm"
              >
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="unanswered">Unanswered</option>
                <option value="trending">Trending</option>
              </select>
            </div>

            {/* Quick Filters */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Quick Filters</label>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1 bg-kawaii-green/30 hover:bg-kawaii-green/50 rounded-kawaii text-sm font-semibold transition-colors duration-200">
                  Solved
                </button>
                <button className="px-3 py-1 bg-kawaii-yellow/30 hover:bg-kawaii-yellow/50 rounded-kawaii text-sm font-semibold transition-colors duration-200">
                  Has Images
                </button>
                <button className="px-3 py-1 bg-kawaii-blue/30 hover:bg-kawaii-blue/50 rounded-kawaii text-sm font-semibold transition-colors duration-200">
                  Following
                </button>
                <button className="px-3 py-1 bg-kawaii-coral/30 hover:bg-kawaii-coral/50 rounded-kawaii text-sm font-semibold transition-colors duration-200">
                  Emergency
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;