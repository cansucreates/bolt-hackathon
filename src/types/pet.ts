export interface PetCard {
  id: string;
  status: 'lost' | 'found';
  name?: string;
  photo: string;
  location: string;
  date: string;
  description: string;
  contactInfo?: string;
  isActive?: boolean;
}

export interface SearchFilters {
  query: string;
  status: 'all' | 'lost' | 'found';
  location: string;
}