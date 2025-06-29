import React, { useState } from 'react';
import { Send, AlertTriangle, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { addComment } from '../../lib/commentService';

interface CommentFormProps {
  postId: string;
  parentId?: string | null;
  onSubmitSuccess: () => void;
  onCancel?: () => void;
  placeholder?: string;
  isTopLevel?: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({ 
  postId, 
  parentId = null, 
  onSubmitSuccess,
  onCancel,
  placeholder = 'Write a comment...',
  isTopLevel = false
}) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to comment');
      return;
    }
    
    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    const result = await addComment({
      content: content.trim(),
      post_id: postId,
      parent_id: parentId
    });
    
    setIsSubmitting(false);
    
    if (result.error) {
      setError(result.error);
    } else {
      setContent('');
      onSubmitSuccess();
    }
  };

  return (
    <div className={`bg-white/90 rounded-kawaii p-4 border ${
      isTopLevel ? 'border-kawaii-purple/50' : 'border-kawaii-purple/30'
    }`}>
      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-kawaii flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-600 flex-shrink-0" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="kawaii-input w-full h-24 resize-none mb-3"
          disabled={isSubmitting || !user}
        />
        
        <div className="flex justify-end gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-kawaii transition-colors duration-200 flex items-center gap-1"
            >
              <X size={16} />
              Cancel
            </button>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting || !user || !content.trim()}
            className="px-4 py-2 text-sm bg-kawaii-purple hover:bg-kawaii-purple-dark disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-kawaii transition-colors duration-200 flex items-center gap-1"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
                Posting...
              </>
            ) : (
              <>
                <Send size={16} />
                Post Comment
              </>
            )}
          </button>
        </div>
        
        {!user && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Please sign in to leave a comment
          </p>
        )}
      </form>
    </div>
  );
};

export default CommentForm;