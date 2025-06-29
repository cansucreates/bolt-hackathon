import React from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface PostCreationButtonProps {
  onClick: () => void;
}

const PostCreationButton: React.FC<PostCreationButtonProps> = ({ onClick }) => {
  const { user } = useAuth();

  return (
    <button
      onClick={onClick}
      disabled={!user}
      className="bg-kawaii-purple hover:bg-kawaii-purple-dark text-gray-700 font-bold py-3 px-6 rounded-kawaii transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      title={user ? 'Create a new post' : 'Sign in to create a post'}
    >
      <Plus size={18} />
      Ask Question
    </button>
  );
};

export default PostCreationButton;