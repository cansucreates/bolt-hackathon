import React, { useState } from 'react';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import LostFoundHeader from '../components/lost-found/LostFoundHeader';
import DynamicMapContainer from '../components/lost-found/DynamicMapContainer';
import SearchPanel from '../components/lost-found/SearchPanel';
import DynamicPetCardsGrid from '../components/lost-found/DynamicPetCardsGrid';
import UnifiedFilterSort from '../components/lost-found/UnifiedFilterSort';
import { usePetReports } from '../hooks/usePetReports';
import { PetReport, ReportFilters } from '../types/lostFound';

type SortOption = 'newest' | 'oldest' | 'nearest';
type ActiveSection = 'all' | 'lost' | 'found';

const DynamicLostFoundPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedReport, setSelectedReport] = useState<PetReport | null>(null);
  const [searchFilters, setSearchFilters] = useState<ReportFilters>({
    type: 'all',
    status: 'active',
    location: '',
    searchQuery: ''
  });

  // Use the custom hook to fetch reports with real-time updates
  const { reports, loading, error, refetch } = usePetReports(searchFilters);

  // Filter and sort reports based on current settings
  const getFilteredAndSortedReports = () => {
    let filtered = reports;

    // Apply section filter
    if (activeSection !== 'all') {
      filtered = filtered.filter(report => report.type === activeSection);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date_reported).getTime() - new Date(a.date_reported).getTime();
        case 'oldest':
          return new Date(a.date_reported).getTime() - new Date(b.date_reported).getTime();
        case 'nearest':
          // For demo purposes, sort by location alphabetically
          return a.location.localeCompare(b.location);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredReports = getFilteredAndSortedReports();
  const lostCount = reports.filter(r => r.type === 'lost').length;
  const foundCount = reports.filter(r => r.type === 'found').length;

  const handleSearch = (filters: any) => {
    setSearchFilters({
      type: filters.status,
      status: 'active',
      location: filters.location,
      searchQuery: filters.query
    });
  };

  const handleSectionChange = (section: ActiveSection) => {
    setActiveSection(section);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
  };

  const handleReportPet = (type: 'lost' | 'found') => {
    // Navigate to the registry page
    window.location.href = `/lost-found/registry?type=${type}&autoOpen=true`;
  };

  const handleReportSelect = (report: PetReport | null) => {
    setSelectedReport(report);
    if (report) {
      // Scroll to the reports section
      const reportsSection = document.getElementById('reports-section');
      if (reportsSection) {
        reportsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating Hearts Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="floating-heart absolute"
            style={{
              left: `${10 + (index * 12)}%`,
              top: `${20 + (index % 3) * 25}%`,
              animationDelay: `${index * 0.5}s`,
              animationDuration: `${3 + (index % 2)}s`
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FFB6D9" stroke="#FFB6D9" strokeWidth="1" opacity="0.3">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
        ))}
      </div>

      <div className="relative z-10">
        <LostFoundHeader />
        
        {/* Connection Status Indicator */}
        <div className="max-w-6xl mx-auto px-4 mb-4">
          <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-kawaii shadow-sm border border-kawaii-blue/30 p-3">
            <div className="flex items-center gap-2">
              {error ? (
                <>
                  <WifiOff size={16} className="text-red-500" />
                  <span className="text-sm text-red-600 font-quicksand">Connection Error</span>
                </>
              ) : (
                <>
                  <Wifi size={16} className="text-green-500" />
                  <span className="text-sm text-green-600 font-quicksand">Live Updates Active</span>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 font-quicksand">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
              <button
                onClick={refetch}
                disabled={loading}
                className="p-2 bg-kawaii-blue hover:bg-kawaii-blue-dark rounded-kawaii transition-colors duration-200 disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw size={16} className={`text-gray-700 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Interactive Map Container */}
        <DynamicMapContainer 
          reports={filteredReports}
          loading={loading}
          onReportSelect={handleReportSelect}
          selectedReport={selectedReport}
        />
        
        <SearchPanel onSearch={handleSearch} onReportPet={handleReportPet} />
        
        {/* Unified Filter and Sort Controls */}
        <UnifiedFilterSort 
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          sortBy={sortBy} 
          onSortChange={handleSortChange}
          lostCount={lostCount}
          foundCount={foundCount}
          totalResults={filteredReports.length}
        />
        
        <div id="reports-section">
          <DynamicPetCardsGrid 
            reports={filteredReports}
            loading={loading}
            error={error}
            onUpdate={refetch}
            activeSection={activeSection}
          />
        </div>

        {/* Results Summary */}
        {!loading && !error && filteredReports.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 pb-8 text-center">
            <p className="text-gray-600 font-quicksand">
              Showing {filteredReports.length} of {reports.length} reports
              {activeSection !== 'all' && ` (${activeSection} only)`}
              {searchFilters.searchQuery && ` matching "${searchFilters.searchQuery}"`}
              {searchFilters.location && ` in ${searchFilters.location}`}
            </p>
          </div>
        )}

        {/* Database Stats */}
        {!loading && !error && (
          <div className="max-w-6xl mx-auto px-4 pb-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-blue/30 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Database Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-kawaii-coral">{lostCount}</div>
                  <div className="text-sm text-gray-600">Lost Pets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-kawaii-green-dark">{foundCount}</div>
                  <div className="text-sm text-gray-600">Found Pets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-kawaii-blue-dark">{reports.length}</div>
                  <div className="text-sm text-gray-600">Total Reports</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-kawaii-purple-dark">
                    {reports.filter(r => r.status === 'active').length}
                  </div>
                  <div className="text-sm text-gray-600">Active Cases</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicLostFoundPage;