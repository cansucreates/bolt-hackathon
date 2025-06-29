import React, { useState, useEffect } from 'react';
import AdoptionHeader from '../components/adoption/AdoptionHeader';
import FilterBar from '../components/adoption/FilterBar';
import AdoptableGrid from '../components/adoption/AdoptableGrid';
import CTABanner from '../components/adoption/CTABanner';
import AdoptionForm from '../components/adoption/AdoptionForm';
import AdoptionApplications from '../components/adoption/AdoptionApplications';
import { AdoptableAnimal, AdoptionFilters } from '../types/adoption';
import { useAuth } from '../contexts/AuthContext';
import { Heart, User, CheckCircle, AlertTriangle } from 'lucide-react';

// Mock data for demonstration
const mockAnimals: AdoptableAnimal[] = [
  {
    id: '1',
    name: 'Bella',
    species: 'dog',
    breed: 'Golden Retriever Mix',
    age: 3,
    ageCategory: 'adult',
    photo: 'https://images.pexels.com/photos/1490908/pexels-photo-1490908.jpeg',
    location: 'Austin, TX',
    story: 'Bella is a sweet and gentle soul who loves long walks and belly rubs. She gets along great with children and other dogs. This beautiful girl has been waiting patiently for her forever family.',
    waitingTime: 45,
    shelter: 'Austin Animal Center',
    contactInfo: 'adopt@austinanimals.org',
    isUrgent: false
  },
  {
    id: '2',
    name: 'Whiskers',
    species: 'cat',
    breed: 'Domestic Shorthair',
    age: 2,
    ageCategory: 'young',
    photo: 'https://images.pexels.com/photos/2061057/pexels-photo-2061057.jpeg',
    location: 'Portland, OR',
    story: 'Whiskers is a playful tabby who loves to chase feather toys and curl up in sunny spots. He\'s looking for a quiet home where he can be the center of attention.',
    waitingTime: 30,
    shelter: 'Oregon Humane Society',
    contactInfo: 'info@oregonhumane.org',
    isUrgent: false
  },
  {
    id: '3',
    name: 'Max',
    species: 'dog',
    breed: 'Corgi Mix',
    age: 5,
    ageCategory: 'adult',
    photo: 'https://images.pexels.com/photos/1629781/pexels-photo-1629781.jpeg',
    location: 'Denver, CO',
    story: 'Max is an energetic and loyal companion who loves to play fetch and go on adventures. He\'s house-trained and knows basic commands. Perfect for an active family!',
    waitingTime: 60,
    shelter: 'Denver Animal Shelter',
    contactInfo: 'adopt@denveranimals.org',
    isUrgent: false
  },
  {
    id: '4',
    name: 'Luna',
    species: 'cat',
    breed: 'Persian Mix',
    age: 1,
    ageCategory: 'young',
    photo: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg',
    location: 'Seattle, WA',
    story: 'Luna is a fluffy princess who enjoys being pampered and loved. She\'s gentle, quiet, and would make a perfect lap cat for someone looking for a calm companion.',
    waitingTime: 20,
    shelter: 'Seattle Animal Shelter',
    contactInfo: 'adopt@seattleanimals.org',
    isUrgent: false
  },
  {
    id: '5',
    name: 'Rocky',
    species: 'dog',
    breed: 'Pit Bull Mix',
    age: 7,
    ageCategory: 'senior',
    photo: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
    location: 'Phoenix, AZ',
    story: 'Rocky is a gentle giant with a heart of gold. Despite his tough appearance, he\'s incredibly sweet and loves nothing more than snuggling on the couch with his humans.',
    waitingTime: 120,
    shelter: 'Arizona Humane Society',
    contactInfo: 'adopt@azhumane.org',
    isUrgent: true
  },
  {
    id: '6',
    name: 'Mittens',
    species: 'cat',
    breed: 'Maine Coon Mix',
    age: 4,
    ageCategory: 'adult',
    photo: 'https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg',
    location: 'Nashville, TN',
    story: 'Mittens is a majestic cat with a fluffy coat and a regal personality. She enjoys watching birds from the window and playing with interactive toys.',
    waitingTime: 75,
    shelter: 'Nashville Humane Association',
    contactInfo: 'adopt@nashvillehumane.org',
    specialNeeds: true
  },
  {
    id: '7',
    name: 'Buddy',
    species: 'dog',
    breed: 'Beagle Mix',
    age: 0.5,
    ageCategory: 'puppy',
    photo: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg',
    location: 'Miami, FL',
    story: 'Buddy is an adorable puppy full of energy and curiosity. He\'s learning basic commands and house training. This little guy will bring endless joy to his new family!',
    waitingTime: 10,
    shelter: 'Miami-Dade Animal Services',
    contactInfo: 'adopt@miamidade.gov',
    isUrgent: false
  },
  {
    id: '8',
    name: 'Shadow',
    species: 'cat',
    breed: 'Black Domestic Shorthair',
    age: 6,
    ageCategory: 'adult',
    photo: 'https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg',
    location: 'Portland, OR',
    story: 'Shadow is a mysterious and elegant black cat who loves to explore and play hide and seek. He\'s independent but also enjoys cuddle sessions with his favorite humans.',
    waitingTime: 90,
    shelter: 'Oregon Humane Society',
    contactInfo: 'adopt@oregonhumane.org',
    isUrgent: false
  },
  {
    id: '9',
    name: 'Daisy',
    species: 'other',
    breed: 'Holland Lop Rabbit',
    age: 2,
    ageCategory: 'young',
    photo: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg',
    location: 'San Francisco, CA',
    story: 'Daisy is a gentle rabbit who loves to hop around and explore. She enjoys fresh vegetables and would do well in a quiet home with plenty of space to roam.',
    waitingTime: 40,
    shelter: 'SF SPCA',
    contactInfo: 'adopt@sfspca.org',
    specialNeeds: true
  },
  {
    id: '10',
    name: 'Zeus',
    species: 'dog',
    breed: 'German Shepherd Mix',
    age: 8,
    ageCategory: 'senior',
    photo: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg',
    location: 'Atlanta, GA',
    story: 'Zeus is a wise and loyal senior dog who still has plenty of love to give. He\'s calm, well-behaved, and would be perfect for someone looking for a mature companion.',
    waitingTime: 150,
    shelter: 'Atlanta Humane Society',
    contactInfo: 'adopt@atlantahumane.org',
    isUrgent: true
  },
  {
    id: '11',
    name: 'Princess',
    species: 'cat',
    breed: 'Siamese Mix',
    age: 9,
    ageCategory: 'senior',
    photo: 'https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg',
    location: 'Boston, MA',
    story: 'Princess is a dignified senior cat who knows what she wants and isn\'t afraid to ask for it. She loves gentle pets and quiet environments where she can relax.',
    waitingTime: 180,
    shelter: 'MSPCA-Angell',
    contactInfo: 'adopt@mspca.org',
    isUrgent: true,
    specialNeeds: true
  },
  {
    id: '12',
    name: 'Cooper',
    species: 'dog',
    breed: 'Labrador Mix',
    age: 1,
    ageCategory: 'young',
    photo: 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg',
    location: 'Las Vegas, NV',
    story: 'Cooper is a young and enthusiastic lab mix who loves to swim, play fetch, and meet new people. He\'s great with kids and would thrive in an active household.',
    waitingTime: 25,
    shelter: 'The Animal Foundation',
    contactInfo: 'adopt@animalfoundation.com',
    isUrgent: false
  }
];

const AdoptionPage: React.FC = () => {
  const { user } = useAuth();
  const [animals, setAnimals] = useState<AdoptableAnimal[]>(mockAnimals);
  const [filteredAnimals, setFilteredAnimals] = useState<AdoptableAnimal[]>(mockAnimals);
  const [loading, setLoading] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<AdoptableAnimal | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showApplicationSuccess, setShowApplicationSuccess] = useState(false);
  const [filters, setFilters] = useState<AdoptionFilters>({
    species: 'all',
    ageRange: 'all',
    location: '',
    sort: 'recent'
  });

  // Apply filters and sorting
  useEffect(() => {
    let filtered = animals;

    // Apply species filter
    if (filters.species !== 'all') {
      filtered = filtered.filter(animal => animal.species === filters.species);
    }

    // Apply age range filter
    if (filters.ageRange !== 'all') {
      filtered = filtered.filter(animal => animal.ageCategory === filters.ageRange);
    }

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter(animal => 
        animal.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sort) {
        case 'recent':
          return a.waitingTime - b.waitingTime; // Recently added = shorter waiting time
        case 'waiting':
          return b.waitingTime - a.waitingTime; // Longest waiting first
        case 'urgent':
          // Urgent cases first, then by waiting time
          if (a.isUrgent && !b.isUrgent) return -1;
          if (!a.isUrgent && b.isUrgent) return 1;
          return b.waitingTime - a.waitingTime;
        default:
          return 0;
      }
    });

    setFilteredAnimals(filtered);
  }, [animals, filters]);

  const handleFilterChange = (newFilters: AdoptionFilters) => {
    setLoading(true);
    setFilters(newFilters);
    
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleAdopt = (animal: AdoptableAnimal) => {
    setSelectedAnimal(animal);
    setShowApplicationForm(true);
  };

  const handleApplicationSuccess = () => {
    setShowApplicationForm(false);
    setShowApplicationSuccess(true);
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setShowApplicationSuccess(false);
    }, 5000);
  };

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
        <AdoptionHeader />
        
        {/* Success Message */}
        {showApplicationSuccess && (
          <div className="max-w-6xl mx-auto px-4 mb-8">
            <div className="bg-green-50 border-2 border-green-200 rounded-kawaii p-4 flex items-center gap-3 animate-slide-in">
              <CheckCircle size={24} className="text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-green-800">Application Submitted Successfully!</h3>
                <p className="text-green-700 font-quicksand">
                  Thanks for applying to adopt {selectedAnimal?.name}! We'll contact you shortly to discuss next steps.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* User's Applications Section */}
        {user && (
          <div className="max-w-6xl mx-auto px-4 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <User size={24} className="text-kawaii-pink-dark" />
                Your Adoption Journey
              </h2>
            </div>
            <AdoptionApplications />
          </div>
        )}
        
        <FilterBar 
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        
        <AdoptableGrid 
          animals={filteredAnimals}
          loading={loading}
          onAdopt={handleAdopt}
        />

        {/* Results Summary */}
        {!loading && filteredAnimals.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 pb-8 text-center">
            <p className="text-gray-600 font-quicksand">
              Showing {filteredAnimals.length} adorable pet{filteredAnimals.length !== 1 ? 's' : ''} ready for adoption
              {filters.species !== 'all' && ` (${filters.species}s only)`}
              {filters.ageRange !== 'all' && ` (${filters.ageRange} only)`}
            </p>
          </div>
        )}

        <CTABanner />
      </div>

      {/* Adoption Application Form Modal */}
      {showApplicationForm && selectedAnimal && (
        <AdoptionForm 
          animal={selectedAnimal}
          onClose={() => setShowApplicationForm(false)}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  );
};

export default AdoptionPage;