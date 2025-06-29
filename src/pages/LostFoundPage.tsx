import React, { useState, useEffect } from 'react';
import LostFoundHeader from '../components/lost-found/LostFoundHeader';
import MapContainer from '../components/lost-found/MapContainer';
import SearchPanel from '../components/lost-found/SearchPanel';
import PetCardsGrid from '../components/lost-found/PetCardsGrid';
import ReportModal from '../components/lost-found/ReportModal';
import UnifiedFilterSort from '../components/lost-found/UnifiedFilterSort';
import { PetCard } from '../types/pet';
import { PetReport } from '../types/lostFound';
import { fetchPetReports } from '../lib/lostFoundService';

type SortOption = 'newest' | 'oldest' | 'nearest';
type ActiveSection = 'all' | 'lost' | 'found';

// Convert PetReport to PetCard format for compatibility with existing components
const convertReportToPetCard = (report: PetReport): PetCard => ({
  id: report.id,
  status: report.type,
  name: report.pet_name || undefined,
  photo: report.photo_url,
  location: report.location,
  date: report.date_reported.split('T')[0], // Convert timestamp to date string
  description: report.description,
  contactInfo: report.contact_info,
  isActive: report.status === 'active'
});

const LostFoundPage: React.FC = () => {
  const [pets, setPets] = useState<PetCard[]>([]);
  const [filteredPets, setFilteredPets] = useState<PetCard[]>([]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState<'lost' | 'found'>('lost');
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<ActiveSection>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPet, setSelectedPet] = useState<PetCard | null>(null);
  const [searchFilters, setSearchFilters] = useState({
    query: '',
    status: 'all' as 'all' | 'lost' | 'found',
    location: ''
  });

  const PETS_PER_PAGE = 12;

  // Load pets from database
  const loadPets = async () => {
    setLoading(true);
    try {
      const result = await fetchPetReports({
        status: 'active' // Only fetch active reports
      });
      
      if (result.data) {
        const petCards = result.data.map(convertReportToPetCard);
        setPets(petCards);
        console.log('Loaded pets from database:', petCards.length);
      } else if (result.error) {
        console.error('Failed to load pets:', result.error);
        // Show error to user but don't break the page
        setPets([]);
      }
    } catch (error) {
      console.error('Error loading pets:', error);
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  // Load pets on component mount
  useEffect(() => {
    loadPets();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = pets;

    // Apply section filter
    if (activeSection !== 'all') {
      filtered = filtered.filter(pet => pet.status === activeSection);
    }

    // Apply search filters
    if (searchFilters.status !== 'all') {
      filtered = filtered.filter(pet => pet.status === searchFilters.status);
    }

    if (searchFilters.query) {
      filtered = filtered.filter(pet => 
        pet.name?.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
        pet.description.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
        pet.location.toLowerCase().includes(searchFilters.query.toLowerCase())
      );
    }

    if (searchFilters.location) {
      filtered = filtered.filter(pet => 
        pet.location.toLowerCase().includes(searchFilters.location.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'nearest':
          // For demo purposes, sort by location alphabetically
          return a.location.localeCompare(b.location);
        default:
          return 0;
      }
    });

    setFilteredPets(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [pets, activeSection, searchFilters, sortBy]);

  const handleSearch = (filters: typeof searchFilters) => {
    setLoading(true);
    setSearchFilters(filters);
    
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleSectionChange = (section: ActiveSection) => {
    setActiveSection(section);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
  };

  const handleReportPet = (type: 'lost' | 'found') => {
    setReportType(type);
    setIsReportModalOpen(true);
  };

  const handleSubmitReport = async (petData: Partial<PetCard>) => {
    // Close modal and reload pets to show the new report
    setIsReportModalOpen(false);
    await loadPets(); // Reload pets from database
  };

  const handlePetSelect = (pet: PetCard) => {
    setSelectedPet(pet);
    // Scroll to the pet cards section
    const petsSection = document.getElementById('pets-section');
    if (petsSection) {
      petsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredPets.length / PETS_PER_PAGE);
  const startIndex = (currentPage - 1) * PETS_PER_PAGE;
  const paginatedPets = filteredPets.slice(startIndex, startIndex + PETS_PER_PAGE);

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Get pets for current page (for infinite scroll, we show all up to current page)
  const displayedPets = filteredPets.slice(0, currentPage * PETS_PER_PAGE);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating Hearts Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Multiple floating hearts with different sizes and positions */}
        <div className="floating-heart absolute top-20 left-10 w-6 h-6 text-kawaii-pink-dark opacity-30">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
        <div className="floating-heart absolute top-40 right-20 w-8 h-8 text-kawaii-pink-dark opacity-25" style={{ animationDelay: '1s' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
        <div className="floating-heart absolute bottom-40 left-20 w-4 h-4 text-kawaii-pink-dark opacity-40" style={{ animationDelay: '2s' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
        <div className="floating-heart absolute bottom-20 right-10 w-5 h-5 text-kawaii-pink-dark opacity-35" style={{ animationDelay: '3s' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
        <div className="floating-heart absolute top-60 left-1/2 w-6 h-6 text-kawaii-pink-dark opacity-30" style={{ animationDelay: '4s' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
        <div className="floating-heart absolute top-32 right-1/3 w-7 h-7 text-kawaii-pink-dark opacity-28" style={{ animationDelay: '5s' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
        <div className="floating-heart absolute bottom-60 right-1/4 w-5 h-5 text-kawaii-pink-dark opacity-32" style={{ animationDelay: '6s' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
        <div className="floating-heart absolute top-80 left-1/4 w-4 h-4 text-kawaii-pink-dark opacity-38" style={{ animationDelay: '7s' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
      </div>

      <div className="relative z-10">
        <LostFoundHeader />
        
        {/* Interactive Map Container */}
        <MapContainer 
          pets={filteredPets} 
          onPetSelect={handlePetSelect}
        />
        
        <SearchPanel onSearch={handleSearch} onReportPet={handleReportPet} />
        
        {/* Unified Filter and Sort Controls */}
        <UnifiedFilterSort 
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          sortBy={sortBy} 
          onSortChange={handleSortChange}
          lostCount={pets.filter(p => p.status === 'lost').length}
          foundCount={pets.filter(p => p.status === 'found').length}
          totalResults={filteredPets.length}
        />
        
        <div id="pets-section">
          <PetCardsGrid 
            pets={displayedPets} 
            loading={loading}
            activeSection={activeSection}
          />
        </div>

        {/* Load More / Pagination */}
        {!loading && displayedPets.length < filteredPets.length && (
          <div className="max-w-6xl mx-auto px-4 pb-16 text-center">
            <button
              onClick={handleLoadMore}
              className="kawaii-button bg-kawaii-purple hover:bg-kawaii-purple-dark text-gray-700 font-bold py-4 px-8 text-lg"
            >
              Load More Pets ({filteredPets.length - displayedPets.length} remaining)
            </button>
          </div>
        )}

        {/* Results Summary */}
        {!loading && filteredPets.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 pb-8 text-center">
            <p className="text-gray-600 font-quicksand">
              Showing {Math.min(displayedPets.length, filteredPets.length)} of {filteredPets.length} pets
              {activeSection !== 'all' && ` (${activeSection} only)`}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && pets.length === 0 && (
          <div className="max-w-6xl mx-auto px-4 pb-16">
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🐾</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No pets reported yet</h3>
              <p className="text-gray-600 font-quicksand mb-8">
                Be the first to help a pet find their way home! Report a lost or found pet to get started.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => handleReportPet('lost')}
                  className="kawaii-button bg-kawaii-coral hover:bg-kawaii-coral/80 text-gray-700 font-bold py-3 px-6"
                >
                  Report Lost Pet
                </button>
                <button
                  onClick={() => handleReportPet('found')}
                  className="kawaii-button bg-kawaii-green hover:bg-kawaii-green-dark text-gray-700 font-bold py-3 px-6"
                >
                  Report Found Pet
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {isReportModalOpen && (
        <ReportModal
          type={reportType}
          onClose={() => setIsReportModalOpen(false)}
          onSubmit={handleSubmitReport}
        />
      )}
    </div>
  );
};

export default LostFoundPage;