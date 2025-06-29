import React from 'react';

interface CommentSkeletonProps {
  depth?: number;
}

const CommentSkeleton: React.FC<CommentSkeletonProps> = ({ depth = 0 }) => {
  return (
    <div className={`mb-4 ${depth > 0 ? 'ml-8 md:ml-12' : ''}`}>
      <div className={`bg-white/90 rounded-kawaii p-4 border animate-pulse ${
        depth > 0 ? 'border-kawaii-purple/30' : 'border-kawaii-purple/50'
      }`}>
        {/* Author Info Skeleton */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gray-200"></div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
        
        {/* Content Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        
        {/* Footer Skeleton */}
        <div className="flex items-center gap-4">
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default CommentSkeleton;