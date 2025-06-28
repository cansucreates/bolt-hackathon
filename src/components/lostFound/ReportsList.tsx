import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, RefreshCw } from 'lucide-react';
import { PetReport, ReportFilters } from '../../types/lostFound';
import { fetchPetReports } from '../../lib/lostFoundService';
import ReportCard from './ReportCard';
import ReportForm from './ReportForm';

const ReportsList: React.FC = () => {
  const [reports, setReports] = useState<PetReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<PetReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<'lost' | 'found'>('lost');
  const [filters, setFilters] = useState<ReportFilters>({
    type: 'all',
    status: 'active',
    searchQuery: '',
    location: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const loadReports = async () => {
    setLoading(true);
    const result = await fetchPetReports(filters);
    
    if (result.data) {
      setReports(result.data);
      setFilteredReports(result.data);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [reports, filters]);

  const applyFilters = () => {
    let filtered = reports;

    // Apply type filter
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(report => report.type === filters.type);
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(report => report.status === filters.status);
    }

    // Apply search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(report => 
        report.description.toLowerCase().includes(query) ||
        report.pet_name?.toLowerCase().includes(query) ||
        report.location.toLowerCase().includes(query)
      );
    }

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter(report => 
        report.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredReports(filtered);
  };

  const handleFilterChange = (key: keyof ReportFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    loadReports();
  };

  const handleReportUpdate = () => {
    loadReports();
  };

  if (showForm) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <ReportForm
            type={formType}
            onSuccess={handleFormSuccess}
            onCancel={() => setShowForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            Lost & Found Pet Reports
          </h1>
          <p className="text-xl text-gray-700 font-quicksand max-w-2xl mx-auto">
            Help reunite pets with their families through PawBackHome
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-pink/30 p-6 mb-8">
          <div className="flex flex-col gap-4">
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Search by pet name, description, or location..."
                value={filters.searchQuery || ''}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                className="kawaii-input pl-12 w-full"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex-1 sm:flex-none px-4 py-3 rounded-kawaii font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                  showFilters 
                    ? 'bg-kawaii-purple text-gray-700 shadow-md' 
                    : 'bg-white/60 text-gray-600 hover:bg-kawaii-purple/30'
                }`}
              >
                <Filter size={18} />
                Filters
              </button>
              
              <button
                onClick={loadReports}
                disabled={loading}
                className="flex-1 sm:flex-none px-4 py-3 bg-kawaii-blue hover:bg-kawaii-blue-dark text-gray-700 font-bold rounded-kawaii transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
              
              <button
                onClick={() => { setFormType('lost'); setShowForm(true); }}
                className="flex-1 sm:flex-none bg-kawaii-coral hover:bg-kawaii-coral/80 text-gray-700 font-bold py-3 px-6 rounded-kawaii transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-md"
              >
                <Plus size={18} />
                Report Lost Pet
              </button>
              
              <button
                onClick={() => { setFormType('found'); setShowForm(true); }}
                className="flex-1 sm:flex-none bg-kawaii-green hover:bg-kawaii-green-dark text-gray-700 font-bold py-3 px-6 rounded-kawaii transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-md"
              >
                <Plus size={18} />
                Report Found Pet
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-kawaii-pink/30 animate-slide-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                  <select
                    value={filters.type || 'all'}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
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
                    onChange={(e) => handleFilterChange('status', e.target.value)}
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
                  <input
                    type="text"
                    placeholder="Filter by location..."
                    value={filters.location || ''}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="kawaii-input w-full text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="pet-cards-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={`loading-${index}`} className="kawaii-pet-card">
                <div className="aspect-video bg-gray-200 rounded-t-kawaii animate-pulse" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded-kawaii animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded-kawaii animate-pulse w-3/4" />
                  <div className="h-4 bg-gray-200 rounded-kawaii animate-pulse w-1/2" />
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded-kawaii animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded-kawaii animate-pulse w-5/6" />
                  </div>
                  <div className="h-10 bg-gray-200 rounded-kawaii animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No reports found</h3>
            <p className="text-gray-600 font-quicksand mb-6">
              {reports.length === 0 
                ? "Be the first to report a lost or found pet!"
                : "Try adjusting your search filters to find more reports."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => { setFormType('lost'); setShowForm(true); }}
                className="bg-kawaii-coral hover:bg-kawaii-coral/80 text-gray-700 font-bold py-3 px-6 rounded-kawaii transition-all duration-300 hover:scale-105"
              >
                Report Lost Pet
              </button>
              <button
                onClick={() => { setFormType('found'); setShowForm(true); }}
                className="bg-kawaii-green hover:bg-kawaii-green-dark text-gray-700 font-bold py-3 px-6 rounded-kawaii transition-all duration-300 hover:scale-105"
              >
                Report Found Pet
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Results Summary */}
            <div className="mb-6 text-center">
              <p className="text-gray-600 font-quicksand">
                Showing {filteredReports.length} of {reports.length} reports
              </p>
            </div>

            {/* Reports Grid */}
            <div className="pet-cards-grid">
              {filteredReports.map((report) => (
                <ReportCard 
                  key={report.id} 
                  report={report} 
                  onUpdate={handleReportUpdate}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportsList;