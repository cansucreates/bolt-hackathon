export interface AdoptableAnimal {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'other';
  breed: string;
  age: number;
  ageCategory: 'puppy' | 'young' | 'adult' | 'senior';
  photo: string;
  location: string;
  story: string;
  specialNeeds?: boolean;
  waitingTime: number; // days
  shelter: string;
  contactInfo: string;
  isUrgent?: boolean;
}

export interface AdoptionFilters {
  species: 'all' | 'dog' | 'cat' | 'other';
  ageRange: 'all' | 'puppy' | 'young' | 'adult' | 'senior';
  location: string;
  sort: 'recent' | 'waiting' | 'urgent';
}

export interface AdoptionApplication {
  id?: string;
  pet_id: string;
  user_id?: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  reason: string;
  has_experience: boolean;
  agrees_to_terms: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  updated_at?: string;
  pet_name?: string;
  pet_photo?: string;
}