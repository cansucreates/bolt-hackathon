import React, { useState, useEffect } from 'react';
import { MessageCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { Comment } from '../../types/community';
import { fetchComments } from '../../lib/commentService';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import CommentSkeleton from './CommentSkeleton';
import EmptyComments from './EmptyComments';

interface CommentListProps {
  postId: string;
}

const CommentList: React.FC<CommentListProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadComments = async () => {
    if (refreshing) return; // Prevent multiple simultaneous refreshes
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading comments for post:', postId);
      const result = await fetchComments(postId);
      
      if (result.error) {
        console.error('Error loading comments:', result.error);
        setError(result.error);
      } else {
        console.log(`Loaded ${result.data?.length || 0} comments`);
        setComments(result.data || []);
      }
    } catch (err) {
      console.error('Unexpected error loading comments:', err);
      setError('An unexpected error occurred while loading comments');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadComments();
    setRefreshing(false);
  };

  const handleCommentSubmitted = () => {
    handleRefresh();
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <MessageCircle size={20} className="text-kawaii-purple-dark" />
          Comments ({loading ? '...' : comments.length})
        </h3>
        
        <button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="px-3 py-1.5 text-sm bg-kawaii-purple/20 hover:bg-kawaii-purple/30 rounded-kawaii transition-colors duration-200 flex items-center gap-1"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-kawaii mb-4 flex items-center gap-2">
          <AlertTriangle size={20} className="text-red-600 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {/* Comment Form */}
      <CommentForm 
        postId={postId}
        onSubmitSuccess={handleCommentSubmitted}
        isTopLevel={true}
      />
      
      {/* Comments List */}
      {loading && !refreshing ? (
        <div className="space-y-4 mt-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <CommentSkeleton key={index} />
          ))}
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4 mt-6">
          {comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              onCommentUpdated={handleCommentSubmitted}
            />
          ))}
        </div>
      ) : (
        <EmptyComments />
      )}
    </div>
  );
};

export default CommentList;