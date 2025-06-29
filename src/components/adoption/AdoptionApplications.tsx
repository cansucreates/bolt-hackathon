import React, { useState, useEffect } from 'react';
import { Calendar, Heart, CheckCircle, Clock, AlertTriangle, X } from 'lucide-react';
import { AdoptionApplication } from '../../types/adoption';
import { getUserAdoptionApplications } from '../../lib/adoptionService';

const AdoptionApplications: React.FC = () => {
  const [applications, setApplications] = useState<AdoptionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadApplications = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await getUserAdoptionApplications();
        
        if (result.error) {
          setError(result.error);
        } else if (result.data) {
          setApplications(result.data);
        }
      } catch (err) {
        setError('Failed to load your adoption applications');
        console.error('Error loading adoption applications:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadApplications();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <CheckCircle size={12} />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <X size={12} />
            Rejected
          </span>
        );
      default:
        return (
          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Clock size={12} />
            Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-pink/30 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-pink/30 p-6">
        <div className="text-center py-8">
          <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Applications</h3>
          <p className="text-gray-600 font-quicksand">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-pink/30 p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Heart size={20} className="text-kawaii-pink-dark" />
        Your Adoption Applications
      </h3>
      
      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((application) => (
            <div key={application.id} className="border border-gray-200 rounded-kawaii p-4 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-start gap-4">
                {application.pet_photo ? (
                  <img 
                    src={application.pet_photo} 
                    alt={application.pet_name || 'Pet'} 
                    className="w-16 h-16 rounded-kawaii object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-kawaii-pink/20 rounded-kawaii flex items-center justify-center">
                    <Heart size={24} className="text-kawaii-pink-dark" />
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-800">
                      {application.pet_name || 'Unknown Pet'}
                    </h4>
                    {getStatusBadge(application.status || 'pending')}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Calendar size={14} className="text-kawaii-blue-dark" />
                    <span>Applied on {formatDate(application.created_at || '')}</span>
                  </div>
                  
                  <p className="text-sm text-gray-700 line-clamp-2 font-quicksand">
                    {application.reason}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Heart size={48} className="text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-bold text-gray-600 mb-2">No applications yet</h4>
          <p className="text-gray-500 font-quicksand">
            You haven't submitted any adoption applications yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdoptionApplications;