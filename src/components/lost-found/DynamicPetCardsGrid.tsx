import React from 'react';
import ReportCard from '../lostFound/ReportCard';
import { PetReport } from '../../types/lostFound';

interface DynamicPetCardsGridProps {
  reports: PetReport[];
  loading: boolean;
  error: string | null;
  onUpdate: () => void;
  activeSection: 'all' | 'lost' | 'found';
}

const DynamicPetCardsGrid: React.FC<DynamicPetCardsGridProps> = ({ 
  reports, 
  loading, 
  error, 
  onUpdate, 
  activeSection 
}) => {
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

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-red-700 mb-2">Error Loading Reports</h3>
          <p className="text-red-600 font-quicksand mb-4">{error}</p>
          <button
            onClick={onUpdate}
            className="bg-kawaii-blue hover:bg-kawaii-blue-dark text-gray-700 font-bold py-3 px-6 rounded-kawaii transition-all duration-300 hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🐾</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No reports found</h3>
          <p className="text-gray-600 font-quicksand">
            {activeSection === 'all' 
              ? "No pet reports in the database yet. Be the first to report a lost or found pet!"
              : `No ${activeSection} pets in the database. Try switching to view all reports.`
            }
          </p>
        </div>
      </div>
    );
  }

  // Filter reports based on active section
  const filteredReports = activeSection === 'all' 
    ? reports 
    : reports.filter(report => report.type === activeSection);

  // When showing all reports, separate them by type
  if (activeSection === 'all') {
    const lostReports = filteredReports.filter(report => report.type === 'lost');
    const foundReports = filteredReports.filter(report => report.type === 'found');

    return (
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="space-y-16">
          {/* Lost Pets Section */}
          {lostReports.length > 0 && (
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 bg-kawaii-coral/20 px-6 py-3 rounded-kawaii border border-kawaii-coral/30">
                  <div className="w-3 h-3 bg-kawaii-coral rounded-full animate-pulse"></div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Lost Pets ({lostReports.length})
                  </h2>
                </div>
                <p className="text-gray-600 font-quicksand mt-2">
                  Help these pets find their way home
                </p>
              </div>
              
              <div className="pet-cards-grid">
                {lostReports.map((report) => (
                  <ReportCard key={report.id} report={report} onUpdate={onUpdate} />
                ))}
              </div>
            </div>
          )}

          {/* Found Pets Section */}
          {foundReports.length > 0 && (
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 bg-kawaii-green/20 px-6 py-3 rounded-kawaii border border-kawaii-green/30">
                  <div className="w-3 h-3 bg-kawaii-green-dark rounded-full animate-pulse"></div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Found Pets ({foundReports.length})
                  </h2>
                </div>
                <p className="text-gray-600 font-quicksand mt-2">
                  These pets are looking for their families
                </p>
              </div>
              
              <div className="pet-cards-grid">
                {foundReports.map((report) => (
                  <ReportCard key={report.id} report={report} onUpdate={onUpdate} />
                ))}
              </div>
            </div>
          )}

          {/* Empty state when no reports in either category */}
          {lostReports.length === 0 && foundReports.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🐾</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No reports found</h3>
              <p className="text-gray-600 font-quicksand">
                No pet reports in the database yet. Be the first to report a lost or found pet!
              </p>
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
        {filteredReports.map((report) => (
          <ReportCard key={report.id} report={report} onUpdate={onUpdate} />
        ))}
      </div>
    </div>
  );
};

export default DynamicPetCardsGrid;