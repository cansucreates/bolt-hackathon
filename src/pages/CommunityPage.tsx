import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  ArrowUpDown, 
  MessageCircle, 
  Heart, 
  Clock, 
  User, 
  Users,
  Tag, 
  ChevronUp, 
  ChevronDown, 
  Pin, 
  Flag, 
  Bell,
  Eye,
  Star,
  Award,
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Home
} from 'lucide-react';
import { ForumPost } from '../types/community';
import PostView from '../components/community/PostView';
import { useAuth } from '../contexts/AuthContext';
import CreatePostModal from '../components/community/CreatePostModal';
import PostCreationButton from '../components/community/PostCreationButton';
import { voteOnPost } from '../lib/communityService';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  postCount: number;
  color: string;
}

const mockCategories: Category[] = [
  {
    id: 'health',
    name: 'Pet Health',
    description: 'Medical questions and health concerns',
    icon: <Heart size={20} />,
    postCount: 0,
    color: 'bg-red-100 text-red-700'
  },
  {
    id: 'behavior',
    name: 'Behavior & Training',
    description: 'Training tips and behavioral issues',
    icon: <Users size={20} />,
    postCount: 0,
    color: 'bg-blue-100 text-blue-700'
  },
  {
    id: 'care',
    name: 'General Care',
    description: 'Daily care, grooming, and nutrition',
    icon: <Star size={20} />,
    postCount: 0,
    color: 'bg-green-100 text-green-700'
  },
  {
    id: 'emergency',
    name: 'Emergency Help',
    description: 'Urgent situations and emergency care',
    icon: <AlertTriangle size={20} />,
    postCount: 0,
    color: 'bg-orange-100 text-orange-700'
  },
  {
    id: 'adoption',
    name: 'Adoption & Rescue',
    description: 'Adoption stories and rescue discussions',
    icon: <Award size={20} />,
    postCount: 0,
    color: 'bg-purple-100 text-purple-700'
  },
  {
    id: 'general',
    name: 'General Discussion',
    description: 'Everything else about pets',
    icon: <MessageCircle size={20} />,
    postCount: 0,
    color: 'bg-gray-100 text-gray-700'
  }
];

type SortOption = 'newest' | 'popular' | 'unanswered' | 'trending';

const CommunityPage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [userVotes, setUserVotes] = useState<{[key: string]: 'up' | 'down' | null}>({});
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = posts;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'popular':
          return (b.upvotes - b.downvotes + b.replies * 2) - (a.upvotes - a.downvotes + a.replies * 2);
        case 'unanswered':
          if (a.replies === 0 && b.replies > 0) return -1;
          if (b.replies === 0 && a.replies > 0) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'trending':
          return b.views - a.views;
        default:
          return 0;
      }
    });

    // Pinned posts always come first
    const pinnedPosts = filtered.filter(post => post.isPinned);
    const regularPosts = filtered.filter(post => !post.isPinned);
    
    setFilteredPosts([...pinnedPosts, ...regularPosts]);
  }, [posts, searchQuery, selectedCategory, sortBy]);

  const handleVote = async (postId: string, voteType: 'up' | 'down') => {
    if (!user) return;

    const currentVote = userVotes[postId];
    let newVote: 'up' | 'down' | null = voteType;
    
    // If clicking the same vote, remove it
    if (currentVote === voteType) {
      newVote = null;
    }

    // Update local state first for immediate feedback
    setUserVotes(prev => ({ ...prev, [postId]: newVote }));

    // Update post votes in local state
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        let upvotes = post.upvotes;
        let downvotes = post.downvotes;

        // Remove previous vote
        if (currentVote === 'up') upvotes--;
        if (currentVote === 'down') downvotes--;

        // Add new vote
        if (newVote === 'up') upvotes++;
        if (newVote === 'down') downvotes++;

        return { ...post, upvotes, downvotes };
      }
      return post;
    }));

    // Send vote to server
    const result = await voteOnPost(postId, voteType);
    
    if (!result.success) {
      // Revert changes if server request fails
      setUserVotes(prev => ({ ...prev, [postId]: currentVote }));
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return { ...post };
        }
        return post;
      }));
    }
  };

  const handleFollow = (postId: string) => {
    if (!user) return;

    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isFollowing: !post.isFollowing }
        : post
    ));
  };

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

  const handlePostCreated = () => {
    // In a real app, this would fetch the latest posts
    // For now, we'll just close the modal
    setShowCreatePostModal(false);
  };

  // If a post is selected, show the post view
  if (selectedPost) {
    return <PostView post={selectedPost} onBack={() => setSelectedPost(null)} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="floating-heart absolute top-20 left-10 w-6 h-6 text-kawaii-purple-dark opacity-30">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
        <div className="floating-heart absolute top-40 right-20 w-8 h-8 text-kawaii-purple-dark opacity-25" style={{ animationDelay: '1s' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
      </div>

      <div className="relative z-10 pt-24 pb-16">
        {/* Header */}
        <div className="max-w-6xl mx-auto px-4 text-center mb-12">
          <div className="mb-8">
            <div className="inline-block bouncing-paw">
              <div className="flex items-center gap-2">
                <MessageCircle size={64} className="text-kawaii-purple-dark md:w-16 md:h-16" />
                <Home size={48} className="text-kawaii-pink-dark md:w-12 md:h-12" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 text-gradient">
            🗣️ Community Forum
          </h1>
          <p className="text-lg md:text-xl text-gray-700 font-quicksand max-w-2xl mx-auto px-4 mb-4">
            Connect with fellow pet lovers, share experiences, and get advice from our caring community
          </p>
          <p className="text-2xl md:text-3xl font-bold text-kawaii-yellow-dark font-quicksand">
            🏡 "Send every paw back home."
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-4">
          {/* Search and Actions Bar */}
          <div className="bg-white/80 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-purple/30 p-4 md:p-6 mb-6 md:mb-8">
            <div className="flex flex-col gap-4">
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  placeholder="Search discussions, topics, or users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="kawaii-input pl-12 w-full"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex-1 sm:flex-none px-4 py-3 rounded-kawaii font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                    showFilters 
                      ? 'bg-kawaii-purple text-gray-700 shadow-md' 
                      : 'bg-white/60 text-gray-600 hover:bg-kawaii-purple/30'
                  }`}
                >
                  <Filter size={18} />
                  Filters
                </button>
                
                <PostCreationButton onClick={() => setShowCreatePostModal(true)} />
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-kawaii-purple/30 animate-slide-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="kawaii-input w-full text-sm"
                    >
                      <option value="all">All Categories</option>
                      {mockCategories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="kawaii-input w-full text-sm"
                    >
                      <option value="newest">Newest</option>
                      <option value="popular">Most Popular</option>
                      <option value="unanswered">Unanswered</option>
                      <option value="trending">Trending</option>
                    </select>
                  </div>

                  {/* Quick Filters */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Quick Filters</label>
                    <div className="flex flex-wrap gap-2">
                      <button className="px-3 py-1 bg-kawaii-green/30 hover:bg-kawaii-green/50 rounded-kawaii text-sm font-semibold transition-colors duration-200">
                        Solved
                      </button>
                      <button className="px-3 py-1 bg-kawaii-yellow/30 hover:bg-kawaii-yellow/50 rounded-kawaii text-sm font-semibold transition-colors duration-200">
                        Has Images
                      </button>
                      <button className="px-3 py-1 bg-kawaii-blue/30 hover:bg-kawaii-blue/50 rounded-kawaii text-sm font-semibold transition-colors duration-200">
                        Following
                      </button>
                      <button className="px-3 py-1 bg-kawaii-coral/30 hover:bg-kawaii-coral/50 rounded-kawaii text-sm font-semibold transition-colors duration-200">
                        Emergency
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Categories Overview */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-6 md:mb-8">
            {mockCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-3 md:p-4 rounded-kawaii border-2 transition-all duration-300 hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'border-kawaii-purple bg-kawaii-purple/20 shadow-md'
                    : 'border-gray-200 bg-white/60 hover:bg-white/80'
                }`}
              >
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${category.color}`}>
                  {React.cloneElement(category.icon as React.ReactElement, { size: window.innerWidth < 768 ? 16 : 20 })}
                </div>
                <h3 className="font-bold text-gray-800 text-xs md:text-sm mb-1 leading-tight">{category.name}</h3>
                <p className="text-xs text-gray-600 mb-1 md:mb-2 hidden md:block">{category.description}</p>
                <span className="text-xs font-semibold text-gray-500">{category.postCount}</span>
              </button>
            ))}
          </div>

          {/* Forum Posts */}
          <div className="space-y-4">
            <div className="text-center py-12 md:py-16">
              <div className="text-4xl md:text-6xl mb-4">🔍</div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-700 mb-2">No discussions found</h3>
              <p className="text-gray-600 font-quicksand px-4">
                Be the first to start a discussion! Click the "Ask Question" button to create a new post.
              </p>
              <div className="mt-8">
                <PostCreationButton onClick={() => setShowCreatePostModal(true)} />
              </div>
            </div>
          </div>

          {/* Community Stats */}
          <div className="mt-12 md:mt-16 bg-white/80 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-purple/30 p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">PawBackHome Community Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-kawaii-purple/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users size={20} className="text-kawaii-purple-dark md:w-6 md:h-6" />
                </div>
                <div className="text-xl md:text-2xl font-bold text-gray-800">0</div>
                <div className="text-xs md:text-sm text-gray-600">Active Members</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-kawaii-blue/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircle size={20} className="text-kawaii-blue-dark md:w-6 md:h-6" />
                </div>
                <div className="text-xl md:text-2xl font-bold text-gray-800">0</div>
                <div className="text-xs md:text-sm text-gray-600">Total Discussions</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-kawaii-green/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle size={20} className="text-kawaii-green-dark md:w-6 md:h-6" />
                </div>
                <div className="text-xl md:text-2xl font-bold text-gray-800">0</div>
                <div className="text-xs md:text-sm text-gray-600">Solved Questions</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-kawaii-yellow/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Home size={20} className="text-kawaii-yellow-dark md:w-6 md:h-6" />
                </div>
                <div className="text-xl md:text-2xl font-bold text-gray-800">0</div>
                <div className="text-xs md:text-sm text-gray-600">Paws Sent Home</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePostModal && (
        <CreatePostModal 
          isOpen={showCreatePostModal}
          onClose={() => setShowCreatePostModal(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
};

export default CommunityPage;