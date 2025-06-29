import React, { useState } from 'react';
import { Heart, Edit2, Trash2, Reply, MoreVertical, CheckCircle, X, Clock } from 'lucide-react';
import { Comment } from '../../types/community';
import { useAuth } from '../../contexts/AuthContext';
import { toggleCommentLike, updateComment, deleteComment } from '../../lib/commentService';
import CommentForm from './CommentForm';

interface CommentItemProps {
  comment: Comment;
  postId: string;
  onCommentUpdated: () => void;
  depth?: number;
  maxDepth?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  postId, 
  onCommentUpdated,
  depth = 0,
  maxDepth = 1
}) => {
  const { user } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [likeCount, setLikeCount] = useState(comment.like_count || 0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAuthor = user?.id === comment.author_id;
  const canReply = depth < maxDepth;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleLikeToggle = async () => {
    if (!user) return;
    
    try {
      console.log('Toggling like for comment:', comment.id);
      
      // Optimistic UI update
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setLikeCount(prev => newIsLiked ? prev + 1 : prev - 1);
      
      const result = await toggleCommentLike(comment.id);
      
      if (!result.success) {
        // Revert optimistic update if failed
        console.error('Failed to toggle like:', result.error);
        setIsLiked(!newIsLiked);
        setLikeCount(prev => !newIsLiked ? prev + 1 : prev - 1);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      // Revert optimistic update
      setIsLiked(!isLiked);
      setLikeCount(prev => !isLiked ? prev + 1 : prev - 1);
    }
  };

  const handleEdit = async () => {
    if (!isAuthor || !editContent.trim()) return;
    
    setIsSubmitting(true);
    try {
      console.log('Updating comment:', comment.id);
      const result = await updateComment(comment.id, editContent);
      
      if (result.error) {
        console.error('Error updating comment:', result.error);
        alert('Failed to update comment: ' + result.error);
      } else {
        console.log('Comment updated successfully');
        setIsEditing(false);
        onCommentUpdated();
      }
    } catch (err) {
      console.error('Unexpected error updating comment:', err);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!isAuthor) return;
    
    setIsSubmitting(true);
    try {
      console.log('Deleting comment:', comment.id);
      const result = await deleteComment(comment.id);
      
      if (result.error) {
        console.error('Error deleting comment:', result.error);
        alert('Failed to delete comment: ' + result.error);
      } else {
        console.log('Comment deleted successfully');
        onCommentUpdated();
      }
    } catch (err) {
      console.error('Unexpected error deleting comment:', err);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleReplySubmit = () => {
    setIsReplying(false);
    onCommentUpdated();
  };

  return (
    <div className={`mb-4 ${depth > 0 ? 'ml-8 md:ml-12' : ''}`}>
      <div className={`bg-white/90 rounded-kawaii p-4 border ${
        depth > 0 ? 'border-kawaii-purple/30' : 'border-kawaii-purple/50'
      }`}>
        {/* Comment Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Author Avatar */}
            <div className="w-8 h-8 rounded-full overflow-hidden bg-kawaii-purple/20 flex-shrink-0">
              {comment.author_avatar ? (
                <img 
                  src={comment.author_avatar} 
                  alt={comment.author_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-kawaii-purple-dark font-bold">
                  {comment.author_name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            {/* Author Info */}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-800 text-sm">{comment.author_name}</span>
                {comment.author_badge && (
                  <span className="px-2 py-0.5 bg-kawaii-purple/20 text-kawaii-purple-dark text-xs rounded-full">
                    {comment.author_badge}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Clock size={12} />
                {formatDate(comment.created_at)}
                {comment.created_at !== comment.updated_at && (
                  <span className="italic">(edited)</span>
                )}
              </div>
            </div>
          </div>
          
          {/* Comment Actions */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <MoreVertical size={16} className="text-gray-500" />
              </button>
              
              {showActions && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-kawaii shadow-md border border-gray-200 py-1 z-10 w-32">
                  {isAuthor && (
                    <>
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setShowActions(false);
                        }}
                        className="w-full px-3 py-1.5 text-left text-sm hover:bg-kawaii-purple/10 flex items-center gap-2"
                      >
                        <Edit2 size={14} className="text-kawaii-purple-dark" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(true);
                          setShowActions(false);
                        }}
                        className="w-full px-3 py-1.5 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </>
                  )}
                  {canReply && (
                    <button
                      onClick={() => {
                        setIsReplying(true);
                        setShowActions(false);
                      }}
                      className="w-full px-3 py-1.5 text-left text-sm hover:bg-kawaii-blue/10 flex items-center gap-2"
                    >
                      <Reply size={14} className="text-kawaii-blue-dark" />
                      Reply
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Comment Content */}
        {isEditing ? (
          <div className="mb-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="kawaii-input w-full h-24 resize-none mb-2"
              placeholder="Edit your comment..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-kawaii transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={isSubmitting}
                className="px-3 py-1.5 text-sm bg-kawaii-purple hover:bg-kawaii-purple-dark text-gray-700 rounded-kawaii transition-colors duration-200 flex items-center gap-1"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3 h-3 border-2 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle size={14} />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-3">
            <p className="text-gray-700 font-quicksand whitespace-pre-wrap break-words">
              {comment.content}
            </p>
          </div>
        )}
        
        {/* Comment Footer */}
        <div className="flex items-center gap-4">
          {/* Like Button */}
          <button
            onClick={handleLikeToggle}
            disabled={!user}
            className={`flex items-center gap-1 text-xs ${
              isLiked 
                ? 'text-kawaii-pink-dark' 
                : 'text-gray-500 hover:text-kawaii-pink-dark'
            } transition-colors duration-200`}
          >
            <Heart 
              size={14} 
              className={isLiked ? 'fill-kawaii-pink-dark' : ''} 
            />
            <span>{likeCount || 0}</span>
          </button>
          
          {/* Reply Button */}
          {user && canReply && !isReplying && (
            <button
              onClick={() => setIsReplying(true)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-kawaii-blue-dark transition-colors duration-200"
            >
              <Reply size={14} />
              Reply
            </button>
          )}
        </div>
        
        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-kawaii">
            <p className="text-sm text-red-700 mb-2">Are you sure you want to delete this comment?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-kawaii transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="px-3 py-1.5 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded-kawaii transition-colors duration-200 flex items-center gap-1"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3 h-3 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={12} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Reply Form */}
      {isReplying && (
        <div className="mt-3 ml-8">
          <CommentForm 
            postId={postId}
            parentId={comment.id}
            onSubmitSuccess={handleReplySubmit}
            onCancel={() => setIsReplying(false)}
            placeholder={`Reply to ${comment.author_name}...`}
          />
        </div>
      )}
      
      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3">
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              onCommentUpdated={onCommentUpdated}
              depth={depth + 1}
              maxDepth={maxDepth}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;