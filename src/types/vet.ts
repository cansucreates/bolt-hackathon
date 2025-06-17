export interface VetService {
  id: string;
  name: string;
  credentials: string;
  type: 'professional' | 'volunteer';
  profilePicture: string;
  distance: number; // in km
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  availableHours: {
    open: string;
    close: string;
    isOpen24h: boolean;
    isAvailableNow: boolean;
  };
  rating: number;
  reviewCount: number;
  specializations: string[];
  services: string[];
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
  isEmergency: boolean;
  acceptsWalkIns: boolean;
  description: string;
}

export interface VetFilters {
  location: string;
  radius: number; // in km
  type: 'all' | 'professional' | 'volunteer';
  availableNow: boolean;
  emergency: boolean;
  serviceType: string;
  minRating: number;
  sort: 'distance' | 'rating' | 'availability';
}