import React, { useState } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  MessageCircle, 
  Eye, 
  Tag, 
  Clock, 
  User, 
  Heart, 
  Share2, 
  Bookmark, 
  Flag, 
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { ForumPost } from '../../types/community';
import CommentList from './CommentList';
import { useAuth } from '../../contexts/AuthContext';

interface PostViewProps {
  post: ForumPost;
  onBack: () => void;
}

const PostView: React.FC<PostViewProps> = ({ post, onBack }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [voteCount, setVoteCount] = useState(post.upvotes - post.downvotes);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleVote = (type: 'up' | 'down') => {
    if (!user) return;
    
    // In a real app, this would call an API to update the vote
    if (type === 'up') {
      setVoteCount(prev => prev + 1);
    } else {
      setVoteCount(prev => prev - 1);
    }
  };

  const handleShare = () => {
    // In a real app, this would open a share dialog
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-kawaii-purple/20 hover:bg-kawaii-purple/30 rounded-kawaii transition-colors duration-200 text-gray-700 font-semibold flex items-center gap-2"
      >
        ← Back to Discussions
      </button>
      
      {/* Post Container */}
      <div className="bg-white/90 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-purple/30 overflow-hidden">
        {/* Post Header */}
        <div className="p-6 border-b border-kawaii-purple/20 bg-kawaii-purple/10">
          <div className="flex items-start gap-4">
            {/* Vote Section */}
            <div className="flex flex-col items-center gap-1 min-w-[60px]">
              <button
                onClick={() => handleVote('up')}
                disabled={!user}
                className={`w-10 h-10 rounded-kawaii transition-all duration-200 flex items-center justify-center ${
                  isLiked
                    ? 'bg-kawaii-green text-green-700'
                    : 'bg-gray-100 hover:bg-kawaii-green/30 text-gray-600'
                }`}
              >
                <ChevronUp size={20} />
              </button>
              
              <span className="font-bold text-lg text-gray-800">
                {voteCount}
              </span>
              
              <button
                onClick={() => handleVote('down')}
                disabled={!user}
                className="w-10 h-10 rounded-kawaii bg-gray-100 hover:bg-kawaii-coral/30 text-gray-600 transition-all duration-200 flex items-center justify-center"
              >
                <ChevronDown size={20} />
              </button>
            </div>
            
            {/* Post Title and Metadata */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {post.isPinned && (
                  <span className="px-2 py-1 bg-kawaii-yellow/30 text-yellow-700 text-xs font-bold rounded-full">
                    Pinned
                  </span>
                )}
                {post.isSolved && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                    <CheckCircle size={12} />
                    Solved
                  </span>
                )}
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                  post.category === 'health' ? 'bg-red-100 text-red-700' :
                  post.category === 'behavior' ? 'bg-blue-100 text-blue-700' :
                  post.category === 'emergency' ? 'bg-orange-100 text-orange-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                </span>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                {post.title}
              </h1>
              
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={post.author.avatar} 
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800">{post.author.name}</span>
                    {post.author.badge && (
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                        post.author.badge === 'Expert' ? 'bg-purple-100 text-purple-700' :
                        post.author.badge === 'Trusted Member' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {post.author.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} />
                    Posted {formatDate(post.createdAt)}
                  </div>
                </div>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {post.tags.map(tag => (
                  <span 
                    key={tag}
                    className="px-2 py-1 bg-kawaii-purple/20 text-kawaii-purple-dark text-xs font-semibold rounded-kawaii"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Post Content */}
        <div className="p-6">
          <div className="prose max-w-none font-quicksand mb-6">
            <p className="whitespace-pre-wrap">{post.content}</p>
            
            {post.hasImages && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <img 
                  src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg" 
                  alt="Post attachment"
                  className="rounded-kawaii w-full h-48 object-cover"
                />
                <img 
                  src="https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg" 
                  alt="Post attachment"
                  className="rounded-kawaii w-full h-48 object-cover"
                />
              </div>
            )}
          </div>
          
          {/* Post Stats */}
          <div className="flex items-center justify-between py-4 border-t border-gray-200">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Eye size={16} />
                <span>{post.views} views</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle size={16} />
                <span>{post.replies} replies</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="p-2 hover:bg-kawaii-blue/20 rounded-full transition-colors duration-200"
                title="Share"
              >
                <Share2 size={18} className="text-kawaii-blue-dark" />
              </button>
              
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-full transition-colors duration-200 ${
                  isBookmarked 
                    ? 'bg-kawaii-yellow/20 text-kawaii-yellow-dark' 
                    : 'hover:bg-kawaii-yellow/20 text-gray-500'
                }`}
                title={isBookmarked ? 'Bookmarked' : 'Bookmark'}
              >
                <Bookmark size={18} className={isBookmarked ? 'fill-kawaii-yellow-dark' : ''} />
              </button>
              
              <button
                className="p-2 hover:bg-red-100 rounded-full transition-colors duration-200"
                title="Report"
              >
                <Flag size={18} className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Comments Section */}
        <div className="p-6 border-t border-kawaii-purple/20 bg-kawaii-purple/5">
          <CommentList postId={post.id} />
        </div>
      </div>
    </div>
  );
};

export default PostView;