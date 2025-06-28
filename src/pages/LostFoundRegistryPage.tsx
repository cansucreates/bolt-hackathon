import React from 'react';
import ReportsList from '../components/lostFound/ReportsList';

const LostFoundRegistryPage: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating Hearts Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="floating-heart absolute"
            style={{
              left: `${10 + (index * 12)}%`,
              top: `${20 + (index % 3) * 25}%`,
              animationDelay: `${index * 0.5}s`,
              animationDuration: `${3 + (index % 2)}s`
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FFB6D9" stroke="#FFB6D9" strokeWidth="1" opacity="0.3">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
        ))}
      </div>

      <div className="relative z-10">
        <ReportsList />
      </div>
    </div>
  );
};

export default LostFoundRegistryPage;