import React from 'react';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="kawaii-pet-card">
      {/* Image Skeleton */}
      <div className="aspect-video bg-gray-200 rounded-t-kawaii animate-pulse" />
      
      {/* Content Skeleton */}
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
  );
};

export default LoadingSkeleton;