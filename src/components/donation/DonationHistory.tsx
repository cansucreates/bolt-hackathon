import React, { useState, useEffect } from 'react';
import { Calendar, Heart, RefreshCw, Download, Filter } from 'lucide-react';
import { getUserOrders } from '../../lib/stripeService';
import { formatCurrency } from '../../lib/donationService';

const DonationHistory: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'recent' | 'oldest'>('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getUserOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    // Additional filtering logic can be added here
    return true;
  }).sort((a, b) => {
    if (filter === 'oldest') {
      return new Date(a.order_date).getTime() - new Date(b.order_date).getTime();
    }
    // Default to recent
    return new Date(b.order_date).getTime() - new Date(a.order_date).getTime();
  });

  const totalDonated = orders.reduce((sum, order) => sum + order.amount_total, 0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'canceled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-md rounded-kawaii shadow-kawaii border-2 border-kawaii-pink/30 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-pink/30 p-6 text-center">
          <Heart size={32} className="text-kawaii-pink-dark mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">
            {formatCurrency(totalDonated / 100)}
          </div>
          <div className="text-sm text-gray-600">Total Donated</div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-blue/30 p-6 text-center">
          <Calendar size={32} className="text-kawaii-blue-dark mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">
            {orders.length}
          </div>
          <div className="text-sm text-gray-600">Total Donations</div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-green/30 p-6 text-center">
          <RefreshCw size={32} className="text-kawaii-green-dark mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">
            0
          </div>
          <div className="text-sm text-gray-600">Recurring</div>
        </div>
      </div>

      {/* Donation History */}
      <div className="bg-white/80 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-purple/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar size={20} className="text-kawaii-purple-dark" />
            Donation History
          </h3>
          
          <div className="flex items-center gap-3">
            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'recent' | 'oldest')}
              className="kawaii-input text-sm py-2 px-3"
            >
              <option value="all">All Donations</option>
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
            </select>
            
            {/* Export Button */}
            <button className="px-4 py-2 bg-kawaii-blue hover:bg-kawaii-blue-dark text-gray-700 font-bold rounded-kawaii transition-colors duration-200 flex items-center gap-2">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {filteredOrders.length > 0 ? (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div key={order.order_id} className="p-4 border border-gray-200 rounded-kawaii hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-kawaii-purple/20 rounded-full flex items-center justify-center">
                      <Heart size={20} className="text-kawaii-purple-dark" />
                    </div>
                    
                    <div>
                      <div className="font-semibold text-gray-800">
                        Donation #{order.order_id.substring(0, 8)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(order.order_date)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-lg text-gray-800">
                      {formatCurrency(order.amount_total / 100)}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.order_status)}`}>
                      {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart size={48} className="text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-gray-600 mb-2">No donations yet</h4>
            <p className="text-gray-500 font-quicksand">
              Start making a difference by supporting animals in need!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationHistory;