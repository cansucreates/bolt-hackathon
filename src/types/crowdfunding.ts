export interface Campaign {
  id: string;
  animalName: string;
  species: 'dog' | 'cat' | 'other';
  image: string;
  story: string;
  location: string;
  goalAmount: number;
  currentAmount: number;
  donorCount: number;
  daysLeft: number;
  isEmergency: boolean;
  isVetVerified: boolean;
  status: 'active' | 'completed' | 'adopted' | 'healed';
  shelter: string;
  medicalCondition?: string;
  isFeatured?: boolean;
  createdAt: string;
  lastUpdated: string;
}

export interface Donor {
  id: string;
  username: string;
  avatar: string;
  totalDonated: number;
  badges: Badge[];
  isAnonymous?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  requirement: number;
  color: string;
}

export interface CrowdfundingFilters {
  animalType: 'all' | 'dog' | 'cat' | 'other';
  location: string;
  emergency: boolean;
  vetVerified: boolean;
  status: 'all' | 'active' | 'completed';
  sort: 'newest' | 'urgent' | 'progress' | 'amount';
}

export interface UserProgress {
  totalDonated: number;
  campaignsSupported: number;
  badges: Badge[];
  points: number;
  level: number;
}