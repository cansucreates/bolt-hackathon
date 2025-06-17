import React from 'react';
import PetCardComponent from './PetCardComponent';
import LoadingSkeleton from './LoadingSkeleton';
import { PetCard } from '../../types/pet';

type ActiveSection = 'all' | 'lost' | 'found';

interface PetCardsGridProps {
  pets: PetCard[];
  loading?: boolean;
  activeSection: ActiveSection;
}

const PetCardsGrid: React.FC<PetCardsGridProps> = ({ pets, loading = false, activeSection }) => {
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="pet-cards-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <LoadingSkeleton key={`loading-${index}`} />
          ))}
        </div>
      </div>
    );
  }

  if (pets.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🐾</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No pets found</h3>
          <p className="text-gray-600 font-quicksand">
            {activeSection === 'all' 
              ? "Try adjusting your search filters or be the first to report a pet!"
              : `No ${activeSection} pets match your search. Try adjusting your filters.`
            }
          </p>
        </div>
      </div>
    );
  }

  // When showing all pets, separate them by status
  if (activeSection === 'all') {
    const lostPets = pets.filter(pet => pet.status === 'lost');
    const foundPets = pets.filter(pet => pet.status === 'found');

    return (
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="space-y-16">
          {/* Lost Pets Section */}
          {lostPets.length > 0 && (
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 bg-kawaii-coral/20 px-6 py-3 rounded-kawaii border border-kawaii-coral/30">
                  <div className="w-3 h-3 bg-kawaii-coral rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Lost Pets ({lostPets.length})
                  </h2>
                </div>
                <p className="text-gray-600 font-quicksand mt-2">
                  Help these pets find their way home
                </p>
              </div>
              
              <div className="pet-cards-grid">
                {lostPets.map((pet) => (
                  <PetCardComponent key={pet.id} pet={pet} />
                ))}
              </div>
            </div>
          )}

          {/* Found Pets Section */}
          {foundPets.length > 0 && (
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 bg-kawaii-mint/20 px-6 py-3 rounded-kawaii border border-kawaii-mint/30">
                  <div className="w-3 h-3 bg-kawaii-mint rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Found Pets ({foundPets.length})
                  </h2>
                </div>
                <p className="text-gray-600 font-quicksand mt-2">
                  These pets are looking for their families
                </p>
              </div>
              
              <div className="pet-cards-grid">
                {foundPets.map((pet) => (
                  <PetCardComponent key={pet.id} pet={pet} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // When showing specific section (lost or found only)
  return (
    <div className="max-w-6xl mx-auto px-4 pb-16">
      <div className="pet-cards-grid">
        {pets.map((pet) => (
          <PetCardComponent key={pet.id} pet={pet} />
        ))}
      </div>
    </div>
  );
};

export default PetCardsGrid;