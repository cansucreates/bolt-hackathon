import React from 'react';
import AnimalCard from './AnimalCard';
import { AdoptableAnimal } from '../../types/adoption';

interface AdoptableGridProps {
  animals: AdoptableAnimal[];
  loading?: boolean;
  onAdopt: (animal: AdoptableAnimal) => void;
}

const AdoptableGrid: React.FC<AdoptableGridProps> = ({ animals, loading = false, onAdopt }) => {
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="pet-cards-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={`loading-${index}`} className="kawaii-pet-card">
              <div className="aspect-video bg-gray-200 rounded-t-kawaii animate-pulse" />
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded-kawaii animate-pulse" />
                <div className="h-4 bg-gray-200 rounded-kawaii animate-pulse w-3/4" />
                <div className="h-4 bg-gray-200 rounded-kawaii animate-pulse w-1/2" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded-kawaii animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded-kawaii animate-pulse w-5/6" />
                </div>
                <div className="h-10 bg-gray-200 rounded-kawaii animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (animals.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🏠</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No pets found</h3>
          <p className="text-gray-600 font-quicksand">
            Try adjusting your filters to find more adorable pets waiting for homes!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pb-16">
      <div className="pet-cards-grid">
        {animals.map((animal) => (
          <AnimalCard 
            key={animal.id} 
            animal={animal} 
            onAdopt={onAdopt}
          />
        ))}
      </div>
    </div>
  );
};

export default AdoptableGrid;