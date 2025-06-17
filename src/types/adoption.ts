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