import React, { useState, useEffect } from 'react';
import { MessageCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { Comment } from '../../types/community';
import { fetchComments } from '../../lib/commentService';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

interface CommentListProps {
  postId: string;
}

const CommentList: React.FC<CommentListProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadComments = async () => {
    setLoading(true);
    setError(null);
    
    const result = await fetchComments(postId);
    
    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setComments(result.data);
    }
    
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadComments();
    setRefreshing(false);
  };

  const handleCommentSubmitted = () => {
    loadComments();
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  if (loading && !refreshing) {
    return (
      <div className="space-y-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <MessageCircle size={20} className="text-kawaii-purple-dark" />
            Comments
          </h3>
        </div>
        
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="bg-white/80 rounded-kawaii p-4 border border-kawaii-purple/30 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gray-200"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="space-y-2 mb-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <MessageCircle size={20} className="text-kawaii-purple-dark" />
          Comments ({comments.length})
        </h3>
        
        <button
          onClick={handleRefresh}
          disabled={refreshing}
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
      {comments.length > 0 ? (
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
        <div className="text-center py-8 bg-white/80 rounded-kawaii border border-kawaii-purple/30">
          <MessageCircle size={32} className="text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 font-quicksand">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      )}
    </div>
  );
};

export default CommentList;