import React, { useState, useEffect } from 'react';
import LostFoundHeader from '../components/lost-found/LostFoundHeader';
import MapContainer from '../components/lost-found/MapContainer';
import SearchPanel from '../components/lost-found/SearchPanel';
import PetCardsGrid from '../components/lost-found/PetCardsGrid';
import ReportModal from '../components/lost-found/ReportModal';
import UnifiedFilterSort from '../components/lost-found/UnifiedFilterSort';
import { PetCard } from '../types/pet';

// Extended mock data for demonstration (12+ cards)
const mockPets: PetCard[] = [
  {
    id: '1',
    status: 'lost',
    name: 'Fluffy',
    photo: 'https://images.pexels.com/photos/1490908/pexels-photo-1490908.jpeg',
    location: 'Central Park, New York',
    date: '2025-01-15',
    description: 'Golden Retriever, very friendly, wearing a red collar with silver tags',
    contactInfo: 'sarah@email.com',
    isActive: true
  },
  {
    id: '2',
    status: 'found',
    photo: 'https://images.pexels.com/photos/2061057/pexels-photo-2061057.jpeg',
    location: 'Main Street, Boston',
    date: '2025-01-16',
    description: 'Tabby cat, no collar, very shy but friendly, appears well-fed',
    contactInfo: 'john@email.com',
    isActive: true
  },
  {
    id: '3',
    status: 'lost',
    name: 'Max',
    photo: 'https://images.pexels.com/photos/1629781/pexels-photo-1629781.jpeg',
    location: 'Riverfront Park, Chicago',
    date: '2025-01-14',
    description: 'Corgi mix, brown and white, loves to play fetch, very energetic',
    contactInfo: 'mike@email.com',
    isActive: true
  },
  {
    id: '4',
    status: 'found',
    photo: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg',
    location: 'Downtown Seattle',
    date: '2025-01-17',
    description: 'Small kitten, orange and white, very playful and curious',
    contactInfo: 'emma@email.com',
    isActive: true
  },
  {
    id: '5',
    status: 'lost',
    name: 'Luna',
    photo: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
    location: 'Golden Gate Park, San Francisco',
    date: '2025-01-13',
    description: 'Border Collie, black and white, responds to whistle, very intelligent',
    contactInfo: 'alex@email.com',
    isActive: true
  },
  {
    id: '6',
    status: 'found',
    photo: 'https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg',
    location: 'Miami Beach, Florida',
    date: '2025-01-18',
    description: 'Small dog, possibly Chihuahua mix, wearing pink sweater',
    contactInfo: 'maria@email.com',
    isActive: true
  },
  {
    id: '7',
    status: 'lost',
    name: 'Buddy',
    photo: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg',
    location: 'Austin Downtown, Texas',
    date: '2025-01-12',
    description: 'German Shepherd mix, large, brown and black, wearing blue collar',
    contactInfo: 'david@email.com',
    isActive: true
  },
  {
    id: '8',
    status: 'found',
    photo: 'https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg',
    location: 'Portland Park, Oregon',
    date: '2025-01-19',
    description: 'Medium-sized mixed breed, brown coat, very friendly with people',
    contactInfo: 'lisa@email.com',
    isActive: true
  },
  {
    id: '9',
    status: 'lost',
    name: 'Whiskers',
    photo: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg',
    location: 'Denver Suburbs, Colorado',
    date: '2025-01-11',
    description: 'Long-haired cat, gray and white, indoor cat, may be hiding',
    contactInfo: 'jennifer@email.com',
    isActive: true
  },
  {
    id: '10',
    status: 'found',
    photo: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg',
    location: 'Nashville Center, Tennessee',
    date: '2025-01-20',
    description: 'Beagle mix, tri-color, wearing faded red collar, very gentle',
    contactInfo: 'robert@email.com',
    isActive: true
  },
  {
    id: '11',
    status: 'lost',
    name: 'Princess',
    photo: 'https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg',
    location: 'Las Vegas Strip, Nevada',
    date: '2025-01-10',
    description: 'Persian cat, white and gray, long fur, very pampered, indoor only',
    contactInfo: 'amanda@email.com',
    isActive: true
  },
  {
    id: '12',
    status: 'found',
    photo: 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg',
    location: 'Phoenix Park, Arizona',
    date: '2025-01-21',
    description: 'Labrador mix, yellow coat, very energetic and loves water',
    contactInfo: 'carlos@email.com',
    isActive: true
  },
  {
    id: '13',
    status: 'lost',
    name: 'Rocky',
    photo: 'https://images.pexels.com/photos/1390361/pexels-photo-1390361.jpeg',
    location: 'Salt Lake City, Utah',
    date: '2025-01-09',
    description: 'Bulldog mix, stocky build, brindle coat, snores loudly',
    contactInfo: 'michelle@email.com',
    isActive: true
  },
  {
    id: '14',
    status: 'found',
    photo: 'https://images.pexels.com/photos/1276553/pexels-photo-1276553.jpeg',
    location: 'Albuquerque, New Mexico',
    date: '2025-01-22',
    description: 'Siamese cat, cream and brown points, blue eyes, very vocal',
    contactInfo: 'thomas@email.com',
    isActive: true
  }
];

type SortOption = 'newest' | 'oldest' | 'nearest';
type ActiveSection = 'all' | 'lost' | 'found';

const LostFoundPage: React.FC = () => {
  const [pets, setPets] = useState<PetCard[]>(mockPets);
  const [filteredPets, setFilteredPets] = useState<PetCard[]>(mockPets);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState<'lost' | 'found'>('lost');
  const [loading, setLoading] = useState(false);
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

  const handleSubmitReport = (petData: Partial<PetCard>) => {
    const newPet: PetCard = {
      id: Date.now().toString(),
      status: reportType,
      photo: petData.photo || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
      location: petData.location || '',
      date: new Date().toISOString().split('T')[0],
      description: petData.description || '',
      name: petData.name,
      contactInfo: petData.contactInfo,
      isActive: true
    };

    setPets(prev => [newPet, ...prev]);
    setIsReportModalOpen(false);
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