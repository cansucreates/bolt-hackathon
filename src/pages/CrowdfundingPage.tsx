import React, { useState, useEffect } from 'react';
import CrowdfundingHeader from '../components/crowdfunding/CrowdfundingHeader';
import FilterBar from '../components/crowdfunding/FilterBar';
import CampaignGrid from '../components/crowdfunding/CampaignGrid';
import EnhancedDonationModal from '../components/donation/EnhancedDonationModal';
import TopDonors from '../components/crowdfunding/TopDonors';
import DonationAnalytics from '../components/crowdfunding/DonationAnalytics';
import EnhancedCampaignCard from '../components/crowdfunding/EnhancedCampaignCard';
import { Campaign, CrowdfundingFilters, Donor } from '../types/crowdfunding';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';

// Mock data for demonstration
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    animalName: 'Luna',
    species: 'dog',
    image: 'https://images.pexels.com/photos/1490908/pexels-photo-1490908.jpeg',
    story: 'Luna needs urgent surgery after being hit by a car. This brave golden retriever is fighting for her life and needs our help to cover the expensive medical bills.',
    location: 'Austin, TX',
    goalAmount: 5000,
    currentAmount: 3200,
    donorCount: 89,
    daysLeft: 12,
    isEmergency: true,
    isVetVerified: true,
    status: 'active',
    shelter: 'Austin Animal Emergency',
    medicalCondition: 'Broken leg, internal injuries',
    isFeatured: true,
    createdAt: '2025-01-15',
    lastUpdated: '2025-01-20'
  },
  {
    id: '2',
    animalName: 'Whiskers',
    species: 'cat',
    image: 'https://images.pexels.com/photos/2061057/pexels-photo-2061057.jpeg',
    story: 'Whiskers was found with severe malnutrition and needs specialized care to recover. Help us give this sweet cat a second chance at life.',
    location: 'Portland, OR',
    goalAmount: 2500,
    currentAmount: 1800,
    donorCount: 45,
    daysLeft: 8,
    isEmergency: false,
    isVetVerified: true,
    status: 'active',
    shelter: 'Oregon Cat Rescue',
    medicalCondition: 'Malnutrition, dental issues',
    isFeatured: false,
    createdAt: '2025-01-10',
    lastUpdated: '2025-01-19'
  },
  {
    id: '3',
    animalName: 'Buddy',
    species: 'dog',
    image: 'https://images.pexels.com/photos/1629781/pexels-photo-1629781.jpeg',
    story: 'Buddy is a senior dog who needs ongoing medical care for his arthritis. Your support helps him live comfortably in his golden years.',
    location: 'Denver, CO',
    goalAmount: 3000,
    currentAmount: 2100,
    donorCount: 67,
    daysLeft: 15,
    isEmergency: false,
    isVetVerified: true,
    status: 'active',
    shelter: 'Denver Senior Pet Sanctuary',
    medicalCondition: 'Arthritis, hip dysplasia',
    isFeatured: false,
    createdAt: '2025-01-12',
    lastUpdated: '2025-01-18'
  },
  {
    id: '4',
    animalName: 'Mittens',
    species: 'cat',
    image: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg',
    story: 'Mittens was rescued from a hoarding situation and needs medical care and rehabilitation to trust humans again.',
    location: 'Seattle, WA',
    goalAmount: 1800,
    currentAmount: 1800,
    donorCount: 52,
    daysLeft: 0,
    isEmergency: false,
    isVetVerified: true,
    status: 'healed',
    shelter: 'Seattle Animal Shelter',
    medicalCondition: 'Trauma recovery, socialization',
    isFeatured: false,
    createdAt: '2025-01-05',
    lastUpdated: '2025-01-20'
  },
  {
    id: '5',
    animalName: 'Rocky',
    species: 'dog',
    image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
    story: 'Rocky was found with a severe skin condition that requires ongoing treatment. He\'s making great progress but needs continued support.',
    location: 'Phoenix, AZ',
    goalAmount: 4200,
    currentAmount: 2800,
    donorCount: 73,
    daysLeft: 18,
    isEmergency: true,
    isVetVerified: true,
    status: 'active',
    shelter: 'Arizona Humane Society',
    medicalCondition: 'Severe dermatitis, allergies',
    isFeatured: true,
    createdAt: '2025-01-08',
    lastUpdated: '2025-01-19'
  },
  {
    id: '6',
    animalName: 'Bella',
    species: 'dog',
    image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg',
    story: 'Bella was hit by a car and needs surgery to repair her broken bones. She\'s a fighter and with your help, she can walk again.',
    location: 'Miami, FL',
    goalAmount: 6000,
    currentAmount: 6000,
    donorCount: 156,
    daysLeft: 0,
    isEmergency: false,
    isVetVerified: true,
    status: 'adopted',
    shelter: 'Miami-Dade Animal Services',
    medicalCondition: 'Multiple fractures, surgery recovery',
    isFeatured: false,
    createdAt: '2024-12-20',
    lastUpdated: '2025-01-15'
  }
];

const mockDonors: Donor[] = [
  {
    id: '1',
    username: 'AnimalLover2024',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    totalDonated: 2450,
    badges: [
      { id: '1', name: 'Animal Hero', icon: '👑', description: 'Donated over $2000', requirement: 2000, color: 'bg-yellow-100 text-yellow-700' },
      { id: '2', name: 'Compassionate Heart', icon: '❤️', description: 'Supported 10+ campaigns', requirement: 10, color: 'bg-red-100 text-red-700' }
    ]
  },
  {
    id: '2',
    username: 'PetRescuer',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    totalDonated: 1890,
    badges: [
      { id: '3', name: 'Guardian Angel', icon: '🛡️', description: 'Emergency campaign supporter', requirement: 5, color: 'bg-blue-100 text-blue-700' }
    ]
  },
  {
    id: '3',
    username: 'KindHeart',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    totalDonated: 1650,
    badges: [
      { id: '4', name: 'Super Supporter', icon: '⭐', description: 'Monthly donor', requirement: 12, color: 'bg-purple-100 text-purple-700' }
    ]
  },
  {
    id: '4',
    username: 'Anonymous',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    totalDonated: 1200,
    badges: [],
    isAnonymous: true
  },
  {
    id: '5',
    username: 'DogMom',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
    totalDonated: 980,
    badges: [
      { id: '5', name: 'Loyal Friend', icon: '🐕', description: 'Dog campaign specialist', requirement: 5, color: 'bg-green-100 text-green-700' }
    ]
  },
  {
    id: '6',
    username: 'CatWhisperer',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg',
    totalDonated: 750,
    badges: [
      { id: '6', name: 'Feline Friend', icon: '🐱', description: 'Cat campaign supporter', requirement: 3, color: 'bg-pink-100 text-pink-700' }
    ]
  }
];

const CrowdfundingPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [loading, setLoading] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [filters, setFilters] = useState<CrowdfundingFilters>({
    animalType: 'all',
    location: '',
    emergency: false,
    vetVerified: false,
    status: 'all',
    sort: 'newest'
  });
  const [showDetailedCampaign, setShowDetailedCampaign] = useState<string | null>(null);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = campaigns;

    // Apply animal type filter
    if (filters.animalType !== 'all') {
      filtered = filtered.filter(campaign => campaign.species === filters.animalType);
    }

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter(campaign => 
        campaign.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Apply emergency filter
    if (filters.emergency) {
      filtered = filtered.filter(campaign => campaign.isEmergency);
    }

    // Apply vet verified filter
    if (filters.vetVerified) {
      filtered = filtered.filter(campaign => campaign.isVetVerified);
    }

    // Apply status filter
    if (filters.status !== 'all') {
      if (filters.status === 'active') {
        filtered = filtered.filter(campaign => campaign.status === 'active');
      } else {
        filtered = filtered.filter(campaign => campaign.status !== 'active');
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sort) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'urgent':
          // Emergency first, then by days left
          if (a.isEmergency && !b.isEmergency) return -1;
          if (!a.isEmergency && b.isEmergency) return 1;
          return a.daysLeft - b.daysLeft;
        case 'progress':
          const aProgress = (a.currentAmount / a.goalAmount) * 100;
          const bProgress = (b.currentAmount / b.goalAmount) * 100;
          return bProgress - aProgress;
        case 'amount':
          return b.goalAmount - a.goalAmount;
        default:
          return 0;
      }
    });

    setFilteredCampaigns(filtered);
  }, [campaigns, filters]);

  const handleFilterChange = (newFilters: CrowdfundingFilters) => {
    setLoading(true);
    setFilters(newFilters);
    
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleDonate = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
  };

  const handleDonationComplete = (amount: number, isAnonymous: boolean) => {
    if (selectedCampaign) {
      // Update campaign with new donation
      setCampaigns(prev => prev.map(campaign => 
        campaign.id === selectedCampaign.id 
          ? { 
              ...campaign, 
              currentAmount: campaign.currentAmount + amount,
              donorCount: campaign.donorCount + 1
            }
          : campaign
      ));
    }
  };

  const toggleDetailedCampaign = (campaignId: string) => {
    setShowDetailedCampaign(prev => prev === campaignId ? null : campaignId);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating Coins Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="floating-heart absolute"
            style={{
              left: `${5 + (index * 8)}%`,
              top: `${10 + (index % 4) * 20}%`,
              animationDelay: `${index * 0.8}s`,
              animationDuration: `${4 + (index % 3)}s`
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FFE5B4" stroke="#FFE5B4" strokeWidth="1" opacity="0.3">
              <circle cx="12" cy="12" r="8"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
        ))}
      </div>

      <div className="relative z-10">
        <CrowdfundingHeader />
        
        <FilterBar 
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        
        {/* Featured Campaign Section */}
        {filteredCampaigns.some(c => c.isFeatured) && (
          <div className="max-w-6xl mx-auto px-4 mb-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 bg-kawaii-yellow/20 px-6 py-3 rounded-kawaii border border-kawaii-yellow/30">
                <div className="w-3 h-3 bg-kawaii-yellow rounded-full animate-pulse"></div>
                <h2 className="text-2xl font-bold text-gray-800">
                  ⭐ Featured Campaigns
                </h2>
              </div>
              <p className="text-gray-600 font-quicksand mt-2 px-4">
                These animals need urgent help - your donation can make all the difference
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredCampaigns
                .filter(campaign => campaign.isFeatured)
                .map(campaign => (
                  <div key={campaign.id}>
                    <EnhancedCampaignCard
                      campaign={campaign}
                      onDonate={handleDonate}
                      isFeatured={true}
                      showStats={showDetailedCampaign === campaign.id}
                    />
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => toggleDetailedCampaign(campaign.id)}
                        className="text-kawaii-yellow-dark hover:text-kawaii-yellow font-semibold flex items-center gap-1 mx-auto"
                      >
                        {showDetailedCampaign === campaign.id ? 'Hide Details' : 'Show Campaign Details'}
                        <ArrowRight size={16} className={`transition-transform duration-300 ${showDetailedCampaign === campaign.id ? 'rotate-90' : ''}`} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
        
        {/* Regular Campaigns */}
        <div className="max-w-6xl mx-auto px-4 mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-kawaii-blue/20 px-6 py-3 rounded-kawaii border border-kawaii-blue/30">
              <div className="w-3 h-3 bg-kawaii-blue rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-800">
                All Campaigns ({filteredCampaigns.filter(c => !c.isFeatured).length})
              </h2>
            </div>
            <p className="text-gray-600 font-quicksand mt-2 px-4">
              Support these animals on their journey to health and happiness
            </p>
          </div>
          
          <div className="campaign-grid">
            {filteredCampaigns
              .filter(campaign => !campaign.isFeatured)
              .map((campaign) => (
                <EnhancedCampaignCard 
                  key={campaign.id} 
                  campaign={campaign} 
                  onDonate={handleDonate}
                />
              ))}
          </div>
        </div>

        {/* Results Summary */}
        {!loading && filteredCampaigns.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 pb-8 text-center">
            <p className="text-gray-600 font-quicksand">
              Showing {filteredCampaigns.length} campaign{filteredCampaigns.length !== 1 ? 's' : ''} 
              {filters.animalType !== 'all' && ` for ${filters.animalType}s`}
              {filters.emergency && ' (emergency only)'}
              {filters.vetVerified && ' (vet verified)'}
            </p>
          </div>
        )}

        {/* Donation Dashboard Link */}
        <div className="max-w-6xl mx-auto px-4 mb-12">
          <div className="bg-white/90 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-yellow/30 p-6 text-center">
            <Heart size={48} className="text-kawaii-yellow-dark mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Track Your Donations
            </h3>
            <p className="text-gray-600 font-quicksand mb-6 max-w-2xl mx-auto">
              View your donation history, see your impact, and get updates on the animals you've helped.
            </p>
            <Link to="/donations">
              <button className="kawaii-button bg-kawaii-yellow hover:bg-kawaii-yellow-dark text-gray-700 font-bold py-3 px-6 flex items-center gap-2 mx-auto">
                <Heart size={18} />
                Go to Donation Dashboard
                <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        </div>

        {/* Bottom sections */}
        <DonationAnalytics />
        
        <TopDonors donors={mockDonors} />
      </div>

      {selectedCampaign && (
        <EnhancedDonationModal
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
          onSuccess={handleDonationComplete}
        />
      )}
    </div>
  );
};

export default CrowdfundingPage;