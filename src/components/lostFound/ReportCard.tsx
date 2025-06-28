import React, { useState } from 'react';
import { MapPin, Calendar, Mail, Phone, Heart, PawPrint, MoreVertical, Edit, Trash2, CheckCircle } from 'lucide-react';
import { PetReport } from '../../types/lostFound';
import { useAuth } from '../../contexts/AuthContext';
import { markReportResolved, deletePetReport } from '../../lib/lostFoundService';

interface ReportCardProps {
  report: PetReport;
  onUpdate: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onUpdate }) => {
  const { user } = useAuth();
  const [showActions, setShowActions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isOwner = user?.id === report.user_id;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
  };

  const handleMarkResolved = async () => {
    if (!isOwner) return;
    
    setIsLoading(true);
    const result = await markReportResolved(report.id);
    
    if (!result.error) {
      onUpdate();
    }
    
    setIsLoading(false);
    setShowActions(false);
  };

  const handleDelete = async () => {
    if (!isOwner || !confirm('Are you sure you want to delete this report?')) return;
    
    setIsLoading(true);
    const result = await deletePetReport(report.id);
    
    if (!result.error) {
      onUpdate();
    }
    
    setIsLoading(false);
    setShowActions(false);
  };

  return (
    <div className={`kawaii-pet-card group h-full flex flex-col relative ${
      report.status === 'resolved' ? 'opacity-75' : ''
    }`}>
      
      {/* Image Container with improved scaling */}
      <div className="relative overflow-hidden rounded-t-kawaii">
        <div className="aspect-video bg-gray-200 relative">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-kawaii-pink/20 animate-pulse flex items-center justify-center">
              <PawPrint size={32} className="text-kawaii-pink-dark opacity-50" />
            </div>
          )}
          <img
            src={report.photo_url}
            alt={report.pet_name || 'Pet photo'}
            className={`w-full h-full object-contain bg-white transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          
          {/* Status Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <div className={`px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1 ${
              report.type === 'lost' 
                ? 'bg-kawaii-coral text-gray-700' 
                : 'bg-kawaii-green text-gray-700'
            }`}>
              {report.type === 'lost' ? (
                <>
                  <PawPrint size={14} />
                  Lost
                </>
              ) : (
                <>
                  <Heart size={14} />
                  Found
                </>
              )}
            </div>
            
            {report.status === 'resolved' && (
              <div className="bg-green-100 border border-green-200 text-green-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                <CheckCircle size={12} />
                Resolved
              </div>
            )}
          </div>

          {/* Actions Menu (for owners) */}
          {isOwner && (
            <div className="absolute top-4 right-4">
              <div className="relative">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all duration-300 flex items-center justify-center"
                >
                  <MoreVertical size={16} className="text-gray-600" />
                </button>
                
                {showActions && (
                  <div className="absolute top-10 right-0 bg-white rounded-kawaii shadow-lg border border-gray-200 py-2 min-w-[120px] z-10">
                    {report.status === 'active' && (
                      <button
                        onClick={handleMarkResolved}
                        disabled={isLoading}
                        className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                      >
                        <CheckCircle size={14} />
                        Mark Resolved
                      </button>
                    )}
                    <button
                      onClick={handleDelete}
                      disabled={isLoading}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col">
        <div className="space-y-3 flex-grow">
          
          {/* Name */}
          {report.pet_name && (
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Heart size={18} className="text-kawaii-pink-dark" />
              {report.pet_name}
            </h3>
          )}

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={16} className="text-kawaii-blue-dark flex-shrink-0" />
            <span className="font-quicksand text-sm">{report.location}</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={16} className="text-kawaii-purple-dark flex-shrink-0" />
            <span className="font-quicksand text-sm">{formatDate(report.date_reported)}</span>
          </div>

          {/* Description */}
          <p className="text-gray-700 font-quicksand text-sm leading-relaxed line-clamp-3">
            {report.description}
          </p>
        </div>

        {/* Contact Section */}
        <div className="mt-6 space-y-3">
          <button
            onClick={() => setShowContact(!showContact)}
            className={`w-full py-3 px-4 rounded-kawaii font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 ${
              report.type === 'lost'
                ? 'bg-kawaii-coral hover:bg-kawaii-coral/80 text-gray-700'
                : 'bg-kawaii-green hover:bg-kawaii-green-dark text-gray-700'
            }`}
          >
            {report.type === 'lost' ? (
              <>
                <Heart size={18} />
                I Found This Pet
              </>
            ) : (
              <>
                <Mail size={18} />
                Contact Finder
              </>
            )}
          </button>

          {/* Contact Info */}
          {showContact && (
            <div className="p-4 bg-kawaii-yellow/30 rounded-kawaii border border-kawaii-yellow animate-slide-in">
              <div className="flex items-center gap-2 text-gray-700">
                <Mail size={16} className="text-kawaii-blue-dark flex-shrink-0" />
                <span className="font-quicksand text-sm break-all">{report.contact_info}</span>
              </div>
              <p className="text-xs text-gray-600 mt-2 font-quicksand">
                Please be respectful when contacting pet owners
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportCard;