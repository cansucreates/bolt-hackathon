import React from 'react';
import { ForumPost } from '../../types/community';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ChevronUp, 
  ChevronDown, 
  MessageCircle, 
  Eye, 
  Tag, 
  Clock, 
  Pin, 
  CheckCircle, 
  Bell, 
  Flag 
} from 'lucide-react';

interface PostListProps {
  posts: ForumPost[];
  userVotes: {[key: string]: 'up' | 'down' | null};
  onVote: (postId: string, voteType: 'up' | 'down') => void;
  onFollow: (postId: string) => void;
  onPostSelect: (post: ForumPost) => void;
  loading?: boolean;
}

const PostList: React.FC<PostListProps> = ({ 
  posts, 
  userVotes, 
  onVote, 
  onFollow, 
  onPostSelect,
  loading = false 
}) => {
  const { user } = useAuth();

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case 'Expert': return 'bg-purple-100 text-purple-700';
      case 'Trusted Member': return 'bg-blue-100 text-blue-700';
      case 'Active Member': return 'bg-green-100 text-green-700';
      case 'New Member': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="bg-white/90 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-purple/30 p-4 md:p-6 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center gap-1 min-w-[50px] md:min-w-[60px]">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-kawaii"></div>
                <div className="h-5 w-5 bg-gray-200 rounded"></div>
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-kawaii"></div>
              </div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="flex gap-1 mb-3">
                  <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
                <div className="flex justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-full"></div>
                    <div className="space-y-1">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                      <div className="h-3 w-32 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-4 w-12 bg-gray-200 rounded"></div>
                    <div className="h-4 w-12 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 md:py-16">
        <div className="text-4xl md:text-6xl mb-4">🔍</div>
        <h3 className="text-xl md:text-2xl font-bold text-gray-700 mb-2">No discussions found</h3>
        <p className="text-gray-600 font-quicksand px-4">
          Try adjusting your search or filters, or be the first to start a discussion!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div 
          key={post.id} 
          className={`bg-white/90 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] p-4 md:p-6 cursor-pointer ${
            post.isPinned ? 'border-kawaii-yellow bg-kawaii-yellow/10' : 'border-kawaii-purple/30'
          }`}
          onClick={() => onPostSelect(post)}
        >
          <div className="flex items-start gap-3 md:gap-4">
            
            {/* Vote Section */}
            <div className="flex flex-col items-center gap-1 min-w-[50px] md:min-w-[60px]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onVote(post.id, 'up');
                }}
                disabled={!user}
                className={`w-8 h-8 md:w-10 md:h-10 rounded-kawaii transition-all duration-200 flex items-center justify-center ${
                  userVotes[post.id] === 'up'
                    ? 'bg-kawaii-green text-green-700'
                    : 'bg-gray-100 hover:bg-kawaii-green/30 text-gray-600'
                }`}
              >
                <ChevronUp size={16} className="md:w-5 md:h-5" />
              </button>
              
              <span className="font-bold text-base md:text-lg text-gray-800">
                {post.upvotes - post.downvotes}
              </span>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onVote(post.id, 'down');
                }}
                disabled={!user}
                className={`w-8 h-8 md:w-10 md:h-10 rounded-kawaii transition-all duration-200 flex items-center justify-center ${
                  userVotes[post.id] === 'down'
                    ? 'bg-kawaii-coral text-red-700'
                    : 'bg-gray-100 hover:bg-kawaii-coral/30 text-gray-600'
                }`}
              >
                <ChevronDown size={16} className="md:w-5 md:h-5" />
              </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {post.isPinned && (
                      <Pin size={14} className="text-kawaii-yellow-dark flex-shrink-0" />
                    )}
                    {post.isSolved && (
                      <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
                    )}
                    <h2 className="text-lg md:text-xl font-bold text-gray-800 hover:text-kawaii-purple-dark transition-colors duration-200 leading-tight">
                      {post.title}
                    </h2>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.tags.slice(0, 3).map(tag => (
                      <span 
                        key={tag}
                        className="px-2 py-1 bg-kawaii-purple/20 text-kawaii-purple-dark text-xs font-semibold rounded-kawaii cursor-pointer hover:bg-kawaii-purple/30 transition-colors duration-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        #{tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="px-2 py-1 text-xs text-gray-500">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1 md:gap-2 ml-2 md:ml-4 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFollow(post.id);
                    }}
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-kawaii transition-all duration-200 flex items-center justify-center ${
                      post.isFollowing
                        ? 'bg-kawaii-blue text-blue-700'
                        : 'bg-gray-100 hover:bg-kawaii-blue/30 text-gray-600'
                    }`}
                    title={post.isFollowing ? 'Unfollow' : 'Follow'}
                  >
                    <Bell size={14} className="md:w-4 md:h-4" />
                  </button>
                  
                  <button 
                    className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 hover:bg-gray-200 rounded-kawaii transition-colors duration-200 text-gray-600 flex items-center justify-center" 
                    title="Report"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Flag size={14} className="md:w-4 md:h-4" />
                  </button>
                </div>
              </div>

              {/* Content Preview */}
              <p className="text-gray-700 font-quicksand leading-relaxed mb-4 line-clamp-3 text-sm md:text-base">
                {post.content}
              </p>

              {/* Author and Stats */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.name}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-gray-800 text-sm md:text-base truncate">{post.author.name}</span>
                      {post.author.badge && (
                        <span className={`px-2 py-1 text-xs font-bold rounded-kawaii ${getBadgeColor(post.author.badge)} flex-shrink-0`}>
                          {post.author.badge}
                        </span>
                      )}
                      <span className="text-xs md:text-sm text-gray-500 flex-shrink-0">• {post.author.reputation} rep</span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500 flex-wrap">
                      <span>Posted {formatTimeAgo(post.createdAt)}</span>
                      <span className="hidden sm:inline">Last active {formatTimeAgo(post.lastActivity)}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-600 flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <MessageCircle size={14} className="md:w-4 md:h-4" />
                    <span className="font-semibold">{post.replies}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye size={14} className="md:w-4 md:h-4" />
                    <span className="font-semibold">{post.views}</span>
                  </div>
                  {post.hasImages && (
                    <div className="flex items-center gap-1">
                      <Tag size={14} className="md:w-4 md:h-4" />
                      <span className="text-xs">Images</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;