import React, { useState, useEffect } from 'react';
import VetHeader from '../components/vet/VetHeader';
import VetSearchPanel from '../components/vet/VetSearchPanel';
import VetMap from '../components/vet/VetMap';
import VetCard from '../components/vet/VetCard';
import { VetService, VetFilters } from '../types/vet';

// Mock data for demonstration
const mockVets: VetService[] = [
  {
    id: '1',
    name: 'Dr. Sarah Wilson',
    credentials: 'DVM, DACVIM',
    type: 'professional',
    profilePicture: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg',
    distance: 2.3,
    location: '123 Main Street, Austin, TX 78701',
    coordinates: { lat: 30.2672, lng: -97.7431 },
    availableHours: {
      open: '8:00 AM',
      close: '6:00 PM',
      isOpen24h: false,
      isAvailableNow: true
    },
    rating: 4.9,
    reviewCount: 127,
    specializations: ['Internal Medicine', 'Cardiology', 'Emergency Care'],
    services: ['Routine Checkup', 'Surgery', 'Emergency Care', 'Dental Care'],
    contactInfo: {
      phone: '(512) 555-0123',
      email: 'dr.wilson@austinvet.com',
      website: 'https://austinvet.com'
    },
    isEmergency: true,
    acceptsWalkIns: true,
    description: 'Dr. Wilson is a board-certified internal medicine specialist with over 15 years of experience. She provides comprehensive care for pets with complex medical conditions and emergency situations.'
  },
  {
    id: '2',
    name: 'Dr. James Chen',
    credentials: 'DVM, MS',
    type: 'professional',
    profilePicture: 'https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg',
    distance: 4.7,
    location: '456 Oak Avenue, Austin, TX 78704',
    coordinates: { lat: 30.2500, lng: -97.7500 },
    availableHours: {
      open: '9:00 AM',
      close: '5:00 PM',
      isOpen24h: false,
      isAvailableNow: false
    },
    rating: 4.8,
    reviewCount: 89,
    specializations: ['Exotic Pets', 'Avian Medicine', 'Small Mammals'],
    services: ['Exotic Pet Care', 'Routine Checkup', 'Surgery', 'Behavioral Consultation'],
    contactInfo: {
      phone: '(512) 555-0456',
      email: 'dr.chen@exoticpetcare.com',
      website: 'https://exoticpetcare.com'
    },
    isEmergency: false,
    acceptsWalkIns: false,
    description: 'Specializing in exotic pets, Dr. Chen provides expert care for birds, reptiles, and small mammals. His clinic is equipped with specialized equipment for unique pet needs.'
  },
  {
    id: '3',
    name: 'Dr. Emily Brooks',
    credentials: 'DVM, DACVS',
    type: 'professional',
    profilePicture: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg',
    distance: 1.8,
    location: '789 Cedar Lane, Austin, TX 78702',
    coordinates: { lat: 30.2800, lng: -97.7200 },
    availableHours: {
      open: '24/7',
      close: '24/7',
      isOpen24h: true,
      isAvailableNow: true
    },
    rating: 5.0,
    reviewCount: 203,
    specializations: ['Surgery', 'Orthopedics', 'Emergency Medicine'],
    services: ['Surgery', 'Emergency Care', 'Orthopedic Surgery', 'Trauma Care'],
    contactInfo: {
      phone: '(512) 555-0789',
      email: 'dr.brooks@emergencyvet.com',
      website: 'https://emergencyvet.com'
    },
    isEmergency: true,
    acceptsWalkIns: true,
    description: 'Board-certified surgeon with 20 years of experience in emergency and critical care. Available 24/7 for surgical emergencies and complex orthopedic procedures.'
  },
  {
    id: '4',
    name: 'Dr. Michael Rodriguez',
    credentials: 'DVM',
    type: 'volunteer',
    profilePicture: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg',
    distance: 6.2,
    location: 'Austin Animal Shelter, 1156 W Cesar Chavez St, Austin, TX',
    coordinates: { lat: 30.2669, lng: -97.7561 },
    availableHours: {
      open: '10:00 AM',
      close: '4:00 PM',
      isOpen24h: false,
      isAvailableNow: true
    },
    rating: 4.7,
    reviewCount: 156,
    specializations: ['General Practice', 'Shelter Medicine', 'Preventive Care'],
    services: ['Vaccination', 'Routine Checkup', 'Spay/Neuter', 'Microchipping'],
    contactInfo: {
      phone: '(512) 555-0321',
      email: 'volunteer@austinshelter.org'
    },
    isEmergency: false,
    acceptsWalkIns: true,
    description: 'Volunteer veterinarian providing affordable care at the Austin Animal Shelter. Focuses on preventive medicine and basic veterinary services for the community.'
  },
  {
    id: '5',
    name: 'Dr. Lisa Thompson',
    credentials: 'DVM, DACVD',
    type: 'professional',
    profilePicture: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg',
    distance: 3.5,
    location: '321 Elm Street, Austin, TX 78705',
    coordinates: { lat: 30.2900, lng: -97.7400 },
    availableHours: {
      open: '8:30 AM',
      close: '5:30 PM',
      isOpen24h: false,
      isAvailableNow: true
    },
    rating: 4.6,
    reviewCount: 74,
    specializations: ['Dermatology', 'Allergies', 'Skin Conditions'],
    services: ['Dermatology', 'Allergy Testing', 'Routine Checkup', 'Grooming'],
    contactInfo: {
      phone: '(512) 555-0654',
      email: 'dr.thompson@petdermatology.com',
      website: 'https://petdermatology.com'
    },
    isEmergency: false,
    acceptsWalkIns: false,
    description: 'Board-certified veterinary dermatologist specializing in skin conditions, allergies, and dermatological disorders in pets. Provides comprehensive skin health solutions.'
  },
  {
    id: '6',
    name: 'Dr. David Kim',
    credentials: 'DVM',
    type: 'volunteer',
    profilePicture: 'https://images.pexels.com/photos/5327584/pexels-photo-5327584.jpeg',
    distance: 8.1,
    location: 'Mobile Vet Unit - Serves Greater Austin Area',
    coordinates: { lat: 30.2400, lng: -97.7800 },
    availableHours: {
      open: '9:00 AM',
      close: '7:00 PM',
      isOpen24h: false,
      isAvailableNow: true
    },
    rating: 4.8,
    reviewCount: 92,
    specializations: ['House Calls', 'Geriatric Care', 'End-of-Life Care'],
    services: ['House Calls', 'Routine Checkup', 'Vaccination', 'Euthanasia'],
    contactInfo: {
      phone: '(512) 555-0987',
      email: 'dr.kim@mobilevet.org'
    },
    isEmergency: false,
    acceptsWalkIns: false,
    description: 'Mobile veterinarian providing in-home care for pets who are stressed by clinic visits or have mobility issues. Specializes in geriatric and palliative care.'
  }
];

const VetPage: React.FC = () => {
  const [vets, setVets] = useState<VetService[]>(mockVets);
  const [filteredVets, setFilteredVets] = useState<VetService[]>(mockVets);
  const [selectedVet, setSelectedVet] = useState<VetService | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<VetFilters>({
    location: 'Austin, TX',
    radius: 10,
    type: 'all',
    availableNow: false,
    emergency: false,
    serviceType: 'All Services',
    minRating: 0,
    sort: 'distance'
  });

  // Apply filters and sorting
  useEffect(() => {
    let filtered = vets;

    // Apply type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(vet => vet.type === filters.type);
    }

    // Apply availability filter
    if (filters.availableNow) {
      filtered = filtered.filter(vet => vet.availableHours.isAvailableNow);
    }

    // Apply emergency filter
    if (filters.emergency) {
      filtered = filtered.filter(vet => vet.isEmergency);
    }

    // Apply service type filter
    if (filters.serviceType !== 'All Services') {
      filtered = filtered.filter(vet => 
        vet.services.some(service => 
          service.toLowerCase().includes(filters.serviceType.toLowerCase())
        )
      );
    }

    // Apply rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter(vet => vet.rating >= filters.minRating);
    }

    // Apply distance filter
    filtered = filtered.filter(vet => vet.distance <= filters.radius);

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sort) {
        case 'distance':
          return a.distance - b.distance;
        case 'rating':
          return b.rating - a.rating;
        case 'availability':
          // Available now first, then by distance
          if (a.availableHours.isAvailableNow && !b.availableHours.isAvailableNow) return -1;
          if (!a.availableHours.isAvailableNow && b.availableHours.isAvailableNow) return 1;
          return a.distance - b.distance;
        default:
          return 0;
      }
    });

    setFilteredVets(filtered);
  }, [vets, filters]);

  const handleFilterChange = (newFilters: VetFilters) => {
    setLoading(true);
    setFilters(newFilters);
    
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleUseCurrentLocation = () => {
    // In a real app, this would use the Geolocation API
    setFilters(prev => ({ ...prev, location: 'Current Location' }));
  };

  const handleVetSelect = (vet: VetService) => {
    setSelectedVet(vet);
    // Scroll to the vet cards section
    const vetCardsSection = document.getElementById('vet-cards-section');
    if (vetCardsSection) {
      vetCardsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContact = (vet: VetService) => {
    alert(`Contacting ${vet.name} at ${vet.contactInfo.phone}`);
  };

  const handleBookAppointment = (vet: VetService) => {
    alert(`Booking appointment with ${vet.name}. In a real app, this would open a booking system.`);
  };

  const handleGetDirections = (vet: VetService) => {
    alert(`Getting directions to ${vet.name} at ${vet.location}`);
  };

  const VetCardsGrid: React.FC = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={`loading-${index}`} className="bg-white/90 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-blue/30 p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 rounded-kawaii animate-pulse w-3/4" />
                  <div className="h-4 bg-gray-200 rounded-kawaii animate-pulse w-1/2" />
                  <div className="h-3 bg-gray-200 rounded-kawaii animate-pulse w-1/4" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded-kawaii animate-pulse" />
                <div className="h-3 bg-gray-200 rounded-kawaii animate-pulse w-5/6" />
                <div className="h-3 bg-gray-200 rounded-kawaii animate-pulse w-4/6" />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="h-10 bg-gray-200 rounded-kawaii animate-pulse" />
                <div className="h-10 bg-gray-200 rounded-kawaii animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (filteredVets.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🩺</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No veterinarians found</h3>
          <p className="text-gray-600 font-quicksand">
            Try adjusting your search filters or expanding your search radius to find more veterinary services.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVets.map((vet) => (
          <VetCard 
            key={vet.id}
            vet={vet}
            onContact={handleContact}
            onBookAppointment={handleBookAppointment}
            onGetDirections={handleGetDirections}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating Hearts Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Multiple floating hearts with different sizes and positions */}
        <div className="floating-heart absolute top-20 left-10 w-6 h-6 text-kawaii-blue-dark opacity-30">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
        <div className="floating-heart absolute top-40 right-20 w-8 h-8 text-kawaii-blue-dark opacity-25" style={{ animationDelay: '1s' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
        <div className="floating-heart absolute bottom-40 left-20 w-4 h-4 text-kawaii-blue-dark opacity-40" style={{ animationDelay: '2s' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
        <div className="floating-heart absolute bottom-20 right-10 w-5 h-5 text-kawaii-blue-dark opacity-35" style={{ animationDelay: '3s' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
        <div className="floating-heart absolute top-60 left-1/2 w-6 h-6 text-kawaii-blue-dark opacity-30" style={{ animationDelay: '4s' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
      </div>

      <div className="relative z-10">
        <VetHeader />
        
        <VetSearchPanel 
          filters={filters}
          onFilterChange={handleFilterChange}
          onUseCurrentLocation={handleUseCurrentLocation}
        />
        
        {/* Map Section - Full Width */}
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <div className="h-96 lg:h-[500px]">
            <VetMap 
              vets={filteredVets}
              loading={loading}
              onVetSelect={handleVetSelect}
              selectedVet={selectedVet}
            />
          </div>
        </div>

        {/* Vet Cards Section */}
        <div id="vet-cards-section" className="max-w-7xl mx-auto px-4 pb-16">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-800 font-quicksand">
                Veterinarians Near You
              </h2>
              <div className="text-lg text-gray-600 font-quicksand">
                {filteredVets.length} result{filteredVets.length !== 1 ? 's' : ''} found
              </div>
            </div>
            {filters.location && (
              <p className="text-gray-600 font-quicksand mt-2 text-lg">
                Within {filters.radius}km of {filters.location}
              </p>
            )}
          </div>

          <VetCardsGrid />
        </div>
      </div>
    </div>
  );
};

export default VetPage;