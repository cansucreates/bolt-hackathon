import React from 'react';
import VetCard from './VetCard';
import { VetService } from '../../types/vet';

interface VetListProps {
  vets: VetService[];
  loading?: boolean;
  onContact: (vet: VetService) => void;
  onBookAppointment: (vet: VetService) => void;
  onGetDirections: (vet: VetService) => void;
  onVetSelect?: (vet: VetService) => void;
}

const VetList: React.FC<VetListProps> = ({ 
  vets, 
  loading = false, 
  onContact, 
  onBookAppointment, 
  onGetDirections,
  onVetSelect 
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={`loading-${index}`} className="bg-white/90 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-blue/30 p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded-kawaii animate-pulse w-3/4" />
                <div className="h-4 bg-gray-200 rounded-kawaii animate-pulse w-1/2" />
                <div className="h-3 bg-gray-200 rounded-kawaii animate-pulse w-1/4" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded-kawaii animate-pulse" />
              <div className="h-3 bg-gray-200 rounded-kawaii animate-pulse w-5/6" />
              <div className="h-3 bg-gray-200 rounded-kawaii animate-pulse w-4/6" />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="h-10 bg-gray-200 rounded-kawaii animate-pulse" />
              <div className="h-10 bg-gray-200 rounded-kawaii animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (vets.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🩺</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-2">No veterinarians found</h3>
        <p className="text-gray-600 font-quicksand">
          Try adjusting your search filters or expanding your search radius to find more veterinary services.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {vets.map((vet) => (
        <div 
          key={vet.id}
          onClick={() => onVetSelect?.(vet)}
          className="cursor-pointer"
        >
          <VetCard 
            vet={vet}
            onContact={onContact}
            onBookAppointment={onBookAppointment}
            onGetDirections={onGetDirections}
          />
        </div>
      ))}
    </div>
  );
};

export default VetList;