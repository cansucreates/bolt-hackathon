import React from 'react';
import { Users, MessageCircle, CheckCircle, Home } from 'lucide-react';

interface CommunityStatsProps {
  stats: {
    activeMembers: number;
    totalDiscussions: number;
    solvedQuestions: number;
    pawsSentHome: number;
  };
}

const CommunityStats: React.FC<CommunityStatsProps> = ({ stats }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-purple/30 p-6 md:p-8">
      <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">PawBackHome Community Stats</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-kawaii-purple/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Users size={20} className="text-kawaii-purple-dark md:w-6 md:h-6" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-gray-800">{stats.activeMembers.toLocaleString()}</div>
          <div className="text-xs md:text-sm text-gray-600">Active Members</div>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-kawaii-blue/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <MessageCircle size={20} className="text-kawaii-blue-dark md:w-6 md:h-6" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-gray-800">{stats.totalDiscussions.toLocaleString()}</div>
          <div className="text-xs md:text-sm text-gray-600">Total Discussions</div>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-kawaii-green/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle size={20} className="text-kawaii-green-dark md:w-6 md:h-6" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-gray-800">{stats.solvedQuestions.toLocaleString()}</div>
          <div className="text-xs md:text-sm text-gray-600">Solved Questions</div>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-kawaii-yellow/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Home size={20} className="text-kawaii-yellow-dark md:w-6 md:h-6" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-gray-800">{stats.pawsSentHome.toLocaleString()}</div>
          <div className="text-xs md:text-sm text-gray-600">Paws Sent Home</div>
        </div>
      </div>
    </div>
  );
};

export default CommunityStats;