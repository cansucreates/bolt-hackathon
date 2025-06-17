import React, { useState } from 'react';
import { PieChart, Download, TrendingUp, DollarSign, Users, Calendar } from 'lucide-react';

interface AnalyticsData {
  totalRaised: number;
  totalDonors: number;
  averageDonation: number;
  campaignsActive: number;
  campaignsCompleted: number;
  categoryBreakdown: {
    medical: number;
    rescue: number;
    shelter: number;
    emergency: number;
  };
}

const DonationAnalytics: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');

  // Mock analytics data
  const analyticsData: AnalyticsData = {
    totalRaised: 127450,
    totalDonors: 1856,
    averageDonation: 68.7,
    campaignsActive: 23,
    campaignsCompleted: 89,
    categoryBreakdown: {
      medical: 45,
      rescue: 25,
      shelter: 20,
      emergency: 10
    }
  };

  const categoryColors = {
    medical: '#FFB6D9',
    rescue: '#B6E6FF', 
    shelter: '#DEB6FF',
    emergency: '#FFDEDE'
  };

  const categoryLabels = {
    medical: 'Medical Care',
    rescue: 'Rescue Operations',
    shelter: 'Shelter Support',
    emergency: 'Emergency Cases'
  };

  const handleDownloadReport = () => {
    // Mock download functionality
    alert('Downloading analytics report...');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 mb-12">
      <div className="bg-white/80 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-blue/30 p-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
          <div className="flex items-center gap-2 mb-4 sm:mb-0">
            <TrendingUp size={24} className="text-kawaii-blue-dark" />
            <h2 className="text-2xl font-bold text-gray-800">Donation Analytics</h2>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Timeframe Selector */}
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as 'week' | 'month' | 'year')}
              className="kawaii-input text-sm py-2 px-4"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            
            {/* Download Button */}
            <button
              onClick={handleDownloadReport}
              className="px-4 py-2 bg-kawaii-green hover:bg-kawaii-green-dark text-gray-700 font-bold rounded-kawaii transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Download Report</span>
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-kawaii-yellow/20 rounded-kawaii p-4 border border-kawaii-yellow/30">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={20} className="text-kawaii-yellow-dark" />
              <span className="text-sm font-semibold text-gray-700">Total Raised</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              ${analyticsData.totalRaised.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-kawaii-pink/20 rounded-kawaii p-4 border border-kawaii-pink/30">
            <div className="flex items-center gap-2 mb-2">
              <Users size={20} className="text-kawaii-pink-dark" />
              <span className="text-sm font-semibold text-gray-700">Total Donors</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {analyticsData.totalDonors.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-kawaii-blue/20 rounded-kawaii p-4 border border-kawaii-blue/30">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={20} className="text-kawaii-blue-dark" />
              <span className="text-sm font-semibold text-gray-700">Avg Donation</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              ${analyticsData.averageDonation}
            </div>
          </div>
          
          <div className="bg-kawaii-green/20 rounded-kawaii p-4 border border-kawaii-green/30">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={20} className="text-kawaii-green-dark" />
              <span className="text-sm font-semibold text-gray-700">Active Campaigns</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {analyticsData.campaignsActive}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Pie Chart */}
          <div className="bg-white/60 rounded-kawaii p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <PieChart size={20} className="text-kawaii-purple-dark" />
              <h3 className="text-lg font-bold text-gray-800">Donation Categories</h3>
            </div>
            
            {/* Simple CSS-based pie chart representation */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  {/* Medical - 45% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={categoryColors.medical}
                    strokeWidth="20"
                    strokeDasharray="113 282"
                    strokeDashoffset="0"
                  />
                  {/* Rescue - 25% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={categoryColors.rescue}
                    strokeWidth="20"
                    strokeDasharray="63 282"
                    strokeDashoffset="-113"
                  />
                  {/* Shelter - 20% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={categoryColors.shelter}
                    strokeWidth="20"
                    strokeDasharray="50 282"
                    strokeDashoffset="-176"
                  />
                  {/* Emergency - 10% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={categoryColors.emergency}
                    strokeWidth="20"
                    strokeDasharray="25 282"
                    strokeDashoffset="-226"
                  />
                </svg>
              </div>
            </div>
            
            {/* Legend */}
            <div className="space-y-2">
              {Object.entries(analyticsData.categoryBreakdown).map(([key, percentage]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: categoryColors[key as keyof typeof categoryColors] }}
                    />
                    <span className="text-sm font-quicksand">
                      {categoryLabels[key as keyof typeof categoryLabels]}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-700">{percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Campaign Status */}
          <div className="bg-white/60 rounded-kawaii p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Campaign Status</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-kawaii-green/20 rounded-kawaii">
                <div>
                  <div className="font-bold text-gray-800">Completed Campaigns</div>
                  <div className="text-sm text-gray-600">Successfully funded</div>
                </div>
                <div className="text-2xl font-bold text-kawaii-green-dark">
                  {analyticsData.campaignsCompleted}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-kawaii-blue/20 rounded-kawaii">
                <div>
                  <div className="font-bold text-gray-800">Active Campaigns</div>
                  <div className="text-sm text-gray-600">Currently fundraising</div>
                </div>
                <div className="text-2xl font-bold text-kawaii-blue-dark">
                  {analyticsData.campaignsActive}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-kawaii-yellow/20 rounded-kawaii">
                <div>
                  <div className="font-bold text-gray-800">Success Rate</div>
                  <div className="text-sm text-gray-600">Campaigns reaching goal</div>
                </div>
                <div className="text-2xl font-bold text-kawaii-yellow-dark">
                  {Math.round((analyticsData.campaignsCompleted / (analyticsData.campaignsCompleted + analyticsData.campaignsActive)) * 100)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationAnalytics;