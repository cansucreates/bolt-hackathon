import React, { useState, useEffect } from 'react';
import { Heart, Users, TrendingUp, Calendar, DollarSign, Award } from 'lucide-react';
import { DonationStats as DonationStatsType } from '../../types/donation';
import { getCampaignDonationStats, formatCurrency } from '../../lib/donationService';

interface DonationStatsProps {
  campaignId: string;
}

const DonationStats: React.FC<DonationStatsProps> = ({ campaignId }) => {
  const [stats, setStats] = useState<DonationStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      const result = await getCampaignDonationStats(campaignId);
      if (result.data) {
        setStats(result.data);
      }
      setLoading(false);
    };

    loadStats();
  }, [campaignId]);

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-blue/30 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="bg-white/80 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-blue/30 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-kawaii-blue-dark" />
          Donation Statistics
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-kawaii-yellow/20 rounded-kawaii">
            <DollarSign size={24} className="text-kawaii-yellow-dark mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              {formatCurrency(stats.totalRaised)}
            </div>
            <div className="text-sm text-gray-600">Total Raised</div>
          </div>
          
          <div className="text-center p-4 bg-kawaii-pink/20 rounded-kawaii">
            <Users size={24} className="text-kawaii-pink-dark mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              {stats.totalDonors}
            </div>
            <div className="text-sm text-gray-600">Donors</div>
          </div>
          
          <div className="text-center p-4 bg-kawaii-green/20 rounded-kawaii">
            <Heart size={24} className="text-kawaii-green-dark mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              {formatCurrency(stats.averageDonation)}
            </div>
            <div className="text-sm text-gray-600">Average</div>
          </div>
          
          <div className="text-center p-4 bg-kawaii-purple/20 rounded-kawaii">
            <Award size={24} className="text-kawaii-purple-dark mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              {stats.topDonors.length}
            </div>
            <div className="text-sm text-gray-600">Top Donors</div>
          </div>
        </div>
      </div>

      {/* Recent Donations */}
      <div className="bg-white/80 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-green/30 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-kawaii-green-dark" />
          Recent Donations
        </h3>
        
        {stats.recentDonations.length > 0 ? (
          <div className="space-y-3">
            {stats.recentDonations.map((donation) => (
              <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-kawaii">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-kawaii-green rounded-full flex items-center justify-center">
                    <Heart size={16} className="text-kawaii-green-dark" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      {donation.is_anonymous ? 'Anonymous Donor' : donation.donor_name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatTimeAgo(donation.created_at)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-kawaii-green-dark">
                    {formatCurrency(donation.amount)}
                  </div>
                  {donation.is_recurring && (
                    <div className="text-xs text-gray-500">Recurring</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-4">No donations yet. Be the first to help!</p>
        )}
      </div>

      {/* Top Donors */}
      <div className="bg-white/80 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-purple/30 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Award size={20} className="text-kawaii-purple-dark" />
          Top Supporters
        </h3>
        
        {stats.topDonors.length > 0 ? (
          <div className="space-y-3">
            {stats.topDonors.map((donor, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-kawaii">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-yellow-400 text-yellow-900' :
                    index === 1 ? 'bg-gray-400 text-gray-900' :
                    index === 2 ? 'bg-orange-400 text-orange-900' :
                    'bg-kawaii-purple text-gray-700'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="font-semibold text-gray-800">
                    {donor.isAnonymous ? 'Anonymous Supporter' : donor.name}
                  </div>
                </div>
                <div className="font-bold text-kawaii-purple-dark">
                  {formatCurrency(donor.amount)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-4">No donations yet. Be the first supporter!</p>
        )}
      </div>
    </div>
  );
};

export default DonationStats;