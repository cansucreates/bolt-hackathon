import React from 'react';
import CampaignCard from './CampaignCard';
import { Campaign } from '../../types/crowdfunding';

interface CampaignGridProps {
  campaigns: Campaign[];
  loading?: boolean;
  onDonate: (campaign: Campaign) => void;
}

const CampaignGrid: React.FC<CampaignGridProps> = ({ campaigns, loading = false, onDonate }) => {
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="campaign-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={`loading-${index}`} className="kawaii-pet-card">
              <div className="aspect-video bg-gray-200 rounded-t-kawaii animate-pulse" />
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="h-5 sm:h-6 bg-gray-200 rounded-kawaii animate-pulse" />
                <div className="h-3 sm:h-4 bg-gray-200 rounded-kawaii animate-pulse w-3/4" />
                <div className="h-3 sm:h-4 bg-gray-200 rounded-kawaii animate-pulse w-1/2" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded-kawaii animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded-kawaii animate-pulse w-5/6" />
                </div>
                <div className="h-3 bg-gray-200 rounded-kawaii animate-pulse w-full" />
                <div className="h-10 sm:h-12 bg-gray-200 rounded-kawaii animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="text-center py-12 sm:py-16">
          <div className="text-4xl sm:text-6xl mb-4">💰</div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">No campaigns found</h3>
          <p className="text-gray-600 font-quicksand px-4">
            Try adjusting your filters to find more campaigns to support!
          </p>
        </div>
      </div>
    );
  }

  // Separate featured and regular campaigns
  const featuredCampaigns = campaigns.filter(campaign => campaign.isFeatured);
  const regularCampaigns = campaigns.filter(campaign => !campaign.isFeatured);

  return (
    <div className="max-w-6xl mx-auto px-4 pb-16">
      
      {/* Featured Campaigns Section */}
      {featuredCampaigns.length > 0 && (
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-kawaii-yellow/20 px-4 sm:px-6 py-2 sm:py-3 rounded-kawaii border border-kawaii-yellow/30">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-kawaii-yellow rounded-full animate-pulse"></div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                ⭐ Featured Campaigns
              </h2>
            </div>
            <p className="text-gray-600 font-quicksand mt-2 px-4 text-sm sm:text-base">
              Urgent cases that need immediate support
            </p>
          </div>
          
          <div className="campaign-grid mb-6 sm:mb-8">
            {featuredCampaigns.map((campaign) => (
              <CampaignCard 
                key={campaign.id} 
                campaign={campaign} 
                onDonate={onDonate}
                isFeatured={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Campaigns Section */}
      {regularCampaigns.length > 0 && (
        <div>
          {featuredCampaigns.length > 0 && (
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-2 sm:gap-3 bg-kawaii-blue/20 px-4 sm:px-6 py-2 sm:py-3 rounded-kawaii border border-kawaii-blue/30">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-kawaii-blue rounded-full"></div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  All Campaigns ({regularCampaigns.length})
                </h2>
              </div>
              <p className="text-gray-600 font-quicksand mt-2 px-4 text-sm sm:text-base">
                Support these animals on their journey to health and happiness
              </p>
            </div>
          )}
          
          <div className="campaign-grid">
            {regularCampaigns.map((campaign) => (
              <CampaignCard 
                key={campaign.id} 
                campaign={campaign} 
                onDonate={onDonate}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignGrid;