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
  Home,
  RefreshCw
} from 'lucide-react';
import { ForumPost } from '../../types/community';
import PostView from '../community/PostView';
import { useAuth } from '../../contexts/AuthContext';
import CreatePostModal from '../community/CreatePostModal';
import PostCreationButton from '../community/PostCreationButton';
import { voteOnPost, fetchPosts, togglePostFollow } from '../../lib/communityService';
import PostList from '../community/PostList';
import CategorySelector from '../community/CategorySelector';
import SearchAndFilters from '../community/SearchAndFilters';
import CommunityStats from '../community/CommunityStats';

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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>(mockCategories);

  // Load posts on component mount and when filters change
  useEffect(() => {
    loadPosts();
  }, [selectedCategory, sortBy, searchQuery]);

  const loadPosts = async () => {
    if (refreshing) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchPosts({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        searchQuery: searchQuery || undefined,
        sortBy,
        page: 1,
        limit: 20
      });
      
      if (result.error) {
        console.error('Error loading posts:', result.error);
        setError(result.error);
        setPosts([]);
      } else {
        console.log('Loaded posts:', result.data);
        setPosts(result.data || []);
        
        // Update category post counts
        const categoryCounts: Record<string, number> = {};
        result.data?.forEach(post => {
          if (!categoryCounts[post.category]) {
            categoryCounts[post.category] = 0;
          }
          categoryCounts[post.category]++;
        });
        
        setCategories(prev => prev.map(category => ({
          ...category,
          postCount: categoryCounts[category.id] || 0
        })));
      }
    } catch (err) {
      console.error('Unexpected error loading posts:', err);
      setError('An unexpected error occurred while loading posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  // Apply filters and sorting
  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

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

  const handleFollow = async (postId: string) => {
    if (!user) return;

    // Optimistic update
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isFollowing: !post.isFollowing }
        : post
    ));

    // Send to server
    const result = await togglePostFollow(postId);
    
    if (!result.success) {
      // Revert on failure
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, isFollowing: !post.isFollowing }
          : post
      ));
    }
  };

  const handlePostCreated = () => {
    setShowCreatePostModal(false);
    handleRefresh(); // Reload posts to show the new one
  };

  // Community stats
  const communityStats = {
    activeMembers: posts.reduce((count, post) => {
      // Count unique authors
      return count + (post.author.id ? 1 : 0);
    }, 0),
    totalDiscussions: posts.length,
    solvedQuestions: posts.filter(post => post.isSolved).length,
    pawsSentHome: 0 // This would come from a different source
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
          <SearchAndFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            onCreatePost={() => setShowCreatePostModal(true)}
            sortBy={sortBy}
            onSortChange={(sort) => setSortBy(sort as SortOption)}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories.map(c => ({ id: c.id, name: c.name }))}
          />

          {/* Categories Overview */}
          <CategorySelector
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-kawaii flex items-center gap-2">
              <AlertTriangle size={20} className="text-red-600 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Refresh Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className="px-4 py-2 bg-kawaii-purple/20 hover:bg-kawaii-purple/30 rounded-kawaii transition-colors duration-200 flex items-center gap-2 text-gray-700"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh Posts'}
            </button>
          </div>

          {/* Forum Posts */}
          <div className="space-y-4">
            <PostList
              posts={filteredPosts}
              userVotes={userVotes}
              onVote={handleVote}
              onFollow={handleFollow}
              onPostSelect={setSelectedPost}
              loading={loading}
            />
          </div>

          {/* Community Stats */}
          <div className="mt-12 md:mt-16">
            <CommunityStats stats={communityStats} />
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