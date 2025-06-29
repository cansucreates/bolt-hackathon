import React, { useState, useEffect } from 'react';
import { Heart, Calendar, DollarSign, Users, Award, TrendingUp, Download, Filter, RefreshCw } from 'lucide-react';
import { getUserDonationHistory, formatCurrency } from '../../lib/donationService';
import { getUserOrders } from '../../lib/stripeService';
import { useAuth } from '../../contexts/AuthContext';
import DonationHistory from './DonationHistory';
import DonationImpactCard from './DonationImpactCard';

const DonationDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'impact'>('overview');
  const [stats, setStats] = useState({
    totalDonated: 0,
    donationCount: 0,
    animalsHelped: 0,
    impactPoints: 0
  });

  useEffect(() => {
    if (user) {
      loadDonationData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadDonationData = async () => {
    setLoading(true);
    try {
      // Load orders from Stripe
      const stripeOrders = await getUserOrders();
      setOrders(stripeOrders);
      
      // Calculate stats
      const totalAmount = stripeOrders.reduce((sum, order) => sum + order.amount_total, 0);
      
      setStats({
        totalDonated: totalAmount / 100, // Convert from cents to dollars
        donationCount: stripeOrders.length,
        animalsHelped: Math.max(1, Math.floor(stripeOrders.length * 1.5)), // Estimate
        impactPoints: Math.floor((totalAmount / 100) * 2) // 2 points per dollar
      });
    } catch (error) {
      console.error('Error loading donation data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-pink/30 p-8 text-center">
        <Heart size={64} className="text-kawaii-pink-dark mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Sign in to view your donation dashboard
        </h2>
        <p className="text-gray-600 font-quicksand mb-6">
          Create an account or sign in to track your donations and see the impact you're making.
        </p>
        <button 
          onClick={() => document.querySelector<HTMLButtonElement>('button:has(.LogIn)')?.click()}
          className="kawaii-button bg-kawaii-pink hover:bg-kawaii-pink-dark text-gray-700 font-bold py-3 px-6"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-pink/30 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded mt-8"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white/90 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-yellow/30 p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome, {profile?.user_name || 'Animal Lover'}!
            </h2>
            <p className="text-gray-600 font-quicksand">
              Thank you for your generosity in helping animals find their way home.
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={loadDonationData}
              className="px-4 py-2 bg-kawaii-blue hover:bg-kawaii-blue-dark text-gray-700 font-bold rounded-kawaii transition-colors duration-200 flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button className="px-4 py-2 bg-kawaii-green hover:bg-kawaii-green-dark text-gray-700 font-bold rounded-kawaii transition-colors duration-200 flex items-center gap-2">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-pink/30 p-6 text-center">
          <DollarSign size={32} className="text-kawaii-pink-dark mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">
            {formatCurrency(stats.totalDonated)}
          </div>
          <div className="text-sm text-gray-600">Total Donated</div>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-blue/30 p-6 text-center">
          <Calendar size={32} className="text-kawaii-blue-dark mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">
            {stats.donationCount}
          </div>
          <div className="text-sm text-gray-600">Donations Made</div>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-green/30 p-6 text-center">
          <Heart size={32} className="text-kawaii-green-dark mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">
            {stats.animalsHelped}
          </div>
          <div className="text-sm text-gray-600">Animals Helped</div>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-purple/30 p-6 text-center">
          <Award size={32} className="text-kawaii-purple-dark mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">
            {stats.impactPoints}
          </div>
          <div className="text-sm text-gray-600">Impact Points</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/90 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-yellow/30 p-2 flex justify-center">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-6 py-3 rounded-kawaii font-bold transition-all duration-300 ${
            activeTab === 'overview'
              ? 'bg-kawaii-yellow text-gray-700 shadow-md'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <TrendingUp size={20} />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-6 py-3 rounded-kawaii font-bold transition-all duration-300 ${
            activeTab === 'history'
              ? 'bg-kawaii-yellow text-gray-700 shadow-md'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Calendar size={20} />
          History
        </button>
        <button
          onClick={() => setActiveTab('impact')}
          className={`flex items-center gap-2 px-6 py-3 rounded-kawaii font-bold transition-all duration-300 ${
            activeTab === 'impact'
              ? 'bg-kawaii-yellow text-gray-700 shadow-md'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Heart size={20} />
          Your Impact
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white/90 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-purple/30 p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Donation Overview</h3>
            
            {orders.length > 0 ? (
              <>
                <div className="bg-kawaii-yellow/20 rounded-kawaii p-6 border border-kawaii-yellow/30">
                  <h4 className="text-lg font-bold text-gray-800 mb-3">Your Donation Summary</h4>
                  <p className="text-gray-600 font-quicksand mb-4">
                    You've made {stats.donationCount} donation{stats.donationCount !== 1 ? 's' : ''} totaling {formatCurrency(stats.totalDonated)}, 
                    helping {stats.animalsHelped} animal{stats.animalsHelped !== 1 ? 's' : ''} find their way home.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/80 rounded-kawaii">
                      <h5 className="font-bold text-gray-800 mb-2">Recent Activity</h5>
                      {orders.slice(0, 2).map((order, index) => (
                        <div key={index} className="flex justify-between items-center mb-2 text-sm">
                          <span>{new Date(order.order_date).toLocaleDateString()}</span>
                          <span className="font-semibold">{formatCurrency(order.amount_total / 100)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-4 bg-white/80 rounded-kawaii">
                      <h5 className="font-bold text-gray-800 mb-2">Impact Badges</h5>
                      <div className="flex flex-wrap gap-2">
                        {stats.totalDonated >= 10 && (
                          <div className="px-3 py-1 bg-kawaii-pink/30 text-gray-700 rounded-full text-xs font-bold">
                            First Donation
                          </div>
                        )}
                        {stats.totalDonated >= 50 && (
                          <div className="px-3 py-1 bg-kawaii-blue/30 text-gray-700 rounded-full text-xs font-bold">
                            Generous Supporter
                          </div>
                        )}
                        {stats.totalDonated >= 100 && (
                          <div className="px-3 py-1 bg-kawaii-green/30 text-gray-700 rounded-full text-xs font-bold">
                            Animal Champion
                          </div>
                        )}
                        {stats.donationCount >= 3 && (
                          <div className="px-3 py-1 bg-kawaii-purple/30 text-gray-700 rounded-full text-xs font-bold">
                            Regular Donor
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <button
                    onClick={() => setActiveTab('history')}
                    className="px-6 py-3 bg-kawaii-yellow hover:bg-kawaii-yellow-dark text-gray-700 font-bold rounded-kawaii transition-all duration-300 hover:scale-105"
                  >
                    View Full History
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Heart size={64} className="text-gray-300 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-gray-700 mb-2">No Donations Yet</h4>
                <p className="text-gray-600 font-quicksand mb-6">
                  You haven't made any donations yet. Start making a difference today!
                </p>
                <a 
                  href="/crowdfunding" 
                  className="px-6 py-3 bg-kawaii-yellow hover:bg-kawaii-yellow-dark text-gray-700 font-bold rounded-kawaii transition-all duration-300 hover:scale-105 inline-block"
                >
                  Browse Campaigns
                </a>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && <DonationHistory />}
        
        {activeTab === 'impact' && <DonationImpactCard stats={stats} />}
      </div>
    </div>
  );
};

export default DonationDashboard;