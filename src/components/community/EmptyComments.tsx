import React from 'react';
import { MessageCircle } from 'lucide-react';

interface EmptyCommentsProps {
  message?: string;
}

const EmptyComments: React.FC<EmptyCommentsProps> = ({ 
  message = 'No comments yet. Be the first to share your thoughts!' 
}) => {
  return (
    <div className="text-center py-8 bg-white/80 rounded-kawaii border border-kawaii-purple/30">
      <MessageCircle size={32} className="text-gray-400 mx-auto mb-2" />
      <p className="text-gray-600 font-quicksand">
        {message}
      </p>
    </div>
  );
};

export default EmptyComments;