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
  Tag, 
  ChevronUp, 
  ChevronDown, 
  Pin, 
  Flag, 
  Bell,
  Eye,
  Star,
  Award,
  Users,
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Home
} from 'lucide-react';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    reputation: number;
    badge?: string;
  };
  category: string;
  tags: string[];
  replies: number;
  views: number;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  lastActivity: string;
  isPinned?: boolean;
  isSolved?: boolean;
  isFollowing?: boolean;
  hasImages?: boolean;
}

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
    postCount: 1247,
    color: 'bg-red-100 text-red-700'
  },
  {
    id: 'behavior',
    name: 'Behavior & Training',
    description: 'Training tips and behavioral issues',
    icon: <Users size={20} />,
    postCount: 892,
    color: 'bg-blue-100 text-blue-700'
  },
  {
    id: 'care',
    name: 'General Care',
    description: 'Daily care, grooming, and nutrition',
    icon: <Star size={20} />,
    postCount: 634,
    color: 'bg-green-100 text-green-700'
  },
  {
    id: 'emergency',
    name: 'Emergency Help',
    description: 'Urgent situations and emergency care',
    icon: <AlertTriangle size={20} />,
    postCount: 156,
    color: 'bg-orange-100 text-orange-700'
  },
  {
    id: 'adoption',
    name: 'Adoption & Rescue',
    description: 'Adoption stories and rescue discussions',
    icon: <Award size={20} />,
    postCount: 423,
    color: 'bg-purple-100 text-purple-700'
  },
  {
    id: 'general',
    name: 'General Discussion',
    description: 'Everything else about pets',
    icon: <MessageCircle size={20} />,
    postCount: 789,
    color: 'bg-gray-100 text-gray-700'
  }
];

const mockPosts: ForumPost[] = [
  {
    id: '1',
    title: 'My dog suddenly stopped eating - should I be worried?',
    content: 'My 3-year-old Golden Retriever hasn\'t eaten anything for the past 24 hours. She\'s usually very food motivated. She\'s drinking water and seems alert, but I\'m getting concerned...',
    author: {
      id: 'user1',
      name: 'Sarah_PetLover',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      reputation: 245,
      badge: 'Trusted Member'
    },
    category: 'health',
    tags: ['dog', 'eating', 'health', 'golden-retriever'],
    replies: 12,
    views: 89,
    upvotes: 8,
    downvotes: 0,
    createdAt: '2025-01-20T10:30:00Z',
    lastActivity: '2025-01-20T14:22:00Z',
    isPinned: false,
    isSolved: false,
    isFollowing: true,
    hasImages: false
  },
  {
    id: '2',
    title: 'Best training methods for aggressive rescue dogs?',
    content: 'I recently adopted a 2-year-old pit bull mix from a shelter. He shows some aggressive tendencies towards other dogs. Looking for positive training methods that have worked for others...',
    author: {
      id: 'user2',
      name: 'DogTrainer_Mike',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      reputation: 892,
      badge: 'Expert'
    },
    category: 'behavior',
    tags: ['dog', 'training', 'rescue', 'aggression', 'pit-bull'],
    replies: 24,
    views: 156,
    upvotes: 18,
    downvotes: 2,
    createdAt: '2025-01-19T16:45:00Z',
    lastActivity: '2025-01-20T13:15:00Z',
    isPinned: true,
    isSolved: true,
    isFollowing: false,
    hasImages: true
  },
  {
    id: '3',
    title: 'Cat won\'t use litter box after moving to new apartment',
    content: 'We moved last week and my usually well-behaved cat has been avoiding the litter box. I\'ve tried different locations and even got a new box. Any suggestions?',
    author: {
      id: 'user3',
      name: 'CatMom_Jenny',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
      reputation: 156,
      badge: 'Active Member'
    },
    category: 'behavior',
    tags: ['cat', 'litter-box', 'moving', 'behavior'],
    replies: 7,
    views: 43,
    upvotes: 5,
    downvotes: 0,
    createdAt: '2025-01-20T08:15:00Z',
    lastActivity: '2025-01-20T12:30:00Z',
    isPinned: false,
    isSolved: false,
    isFollowing: false,
    hasImages: false
  },
  {
    id: '4',
    title: 'Emergency: My puppy ate chocolate - what should I do?',
    content: 'My 4-month-old puppy just ate a small piece of dark chocolate that fell on the floor. I\'m panicking! Should I take him to the vet immediately or monitor him?',
    author: {
      id: 'user4',
      name: 'NewPuppyParent',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      reputation: 23,
      badge: 'New Member'
    },
    category: 'emergency',
    tags: ['puppy', 'chocolate', 'emergency', 'poison'],
    replies: 15,
    views: 78,
    upvotes: 12,
    downvotes: 0,
    createdAt: '2025-01-20T11:45:00Z',
    lastActivity: '2025-01-20T14:10:00Z',
    isPinned: false,
    isSolved: true,
    isFollowing: true,
    hasImages: false
  },
  {
    id: '5',
    title: 'Best diet for senior cats with kidney issues?',
    content: 'My 14-year-old cat was recently diagnosed with early kidney disease. The vet recommended a special diet, but I\'d love to hear from others who have dealt with this...',
    author: {
      id: 'user5',
      name: 'SeniorCatCare',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
      reputation: 445,
      badge: 'Trusted Member'
    },
    category: 'health',
    tags: ['cat', 'senior', 'kidney', 'diet', 'nutrition'],
    replies: 9,
    views: 67,
    upvotes: 11,
    downvotes: 1,
    createdAt: '2025-01-19T14:20:00Z',
    lastActivity: '2025-01-20T09:45:00Z',
    isPinned: false,
    isSolved: false,
    isFollowing: false,
    hasImages: false
  },
  {
    id: '6',
    title: 'Success story: From fearful rescue to therapy dog!',
    content: 'I wanted to share an amazing transformation story. Two years ago, I adopted a severely traumatized rescue dog. Today, she passed her therapy dog certification! Here\'s our journey...',
    author: {
      id: 'user6',
      name: 'TherapyDogMom',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg',
      reputation: 678,
      badge: 'Expert'
    },
    category: 'adoption',
    tags: ['rescue', 'therapy-dog', 'success-story', 'training'],
    replies: 31,
    views: 234,
    upvotes: 45,
    downvotes: 0,
    createdAt: '2025-01-18T20:30:00Z',
    lastActivity: '2025-01-20T13:50:00Z',
    isPinned: true,
    isSolved: false,
    isFollowing: true,
    hasImages: true
  }
];

type SortOption = 'newest' | 'popular' | 'unanswered' | 'trending';

const CommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>(mockPosts);
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>(mockPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Mock login state
  const [userVotes, setUserVotes] = useState<{[key: string]: 'up' | 'down' | null}>({});

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

  const handleVote = (postId: string, voteType: 'up' | 'down') => {
    if (!isLoggedIn) return;

    const currentVote = userVotes[postId];
    let newVote: 'up' | 'down' | null = voteType;
    
    // If clicking the same vote, remove it
    if (currentVote === voteType) {
      newVote = null;
    }

    setUserVotes(prev => ({ ...prev, [postId]: newVote }));

    // Update post votes
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
  };

  const handleFollow = (postId: string) => {
    if (!isLoggedIn) return;

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
        <div className="max-w-6xl mx-auto px-4 text-center mb-8 md:mb-12">
          <div className="mb-6 md:mb-8">
            <div className="inline-block bouncing-paw">
              <div className="flex items-center gap-2">
                <MessageCircle size={48} className="text-kawaii-purple-dark md:w-16 md:h-16" />
                <Home size={32} className="text-kawaii-pink-dark md:w-12 md:h-12" />
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
                
                <button className="flex-1 sm:flex-none bg-kawaii-purple hover:bg-kawaii-purple-dark text-gray-700 font-bold py-3 px-6 rounded-kawaii transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-md">
                  <Plus size={18} />
                  Ask Question
                </button>
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
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12 md:py-16">
                <div className="text-4xl md:text-6xl mb-4">🔍</div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-700 mb-2">No discussions found</h3>
                <p className="text-gray-600 font-quicksand px-4">
                  Try adjusting your search or filters, or be the first to start a discussion!
                </p>
              </div>
            ) : (
              filteredPosts.map(post => (
                <div 
                  key={post.id} 
                  className={`bg-white/90 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] p-4 md:p-6 ${
                    post.isPinned ? 'border-kawaii-yellow bg-kawaii-yellow/10' : 'border-kawaii-purple/30'
                  }`}
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    
                    {/* Vote Section - Fixed centering */}
                    <div className="flex flex-col items-center gap-1 min-w-[50px] md:min-w-[60px]">
                      <button
                        onClick={() => handleVote(post.id, 'up')}
                        disabled={!isLoggedIn}
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
                        onClick={() => handleVote(post.id, 'down')}
                        disabled={!isLoggedIn}
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
                            <h2 className="text-lg md:text-xl font-bold text-gray-800 hover:text-kawaii-purple-dark cursor-pointer transition-colors duration-200 leading-tight">
                              {post.title}
                            </h2>
                          </div>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {post.tags.slice(0, 3).map(tag => (
                              <span 
                                key={tag}
                                className="px-2 py-1 bg-kawaii-purple/20 text-kawaii-purple-dark text-xs font-semibold rounded-kawaii cursor-pointer hover:bg-kawaii-purple/30 transition-colors duration-200"
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

                        {/* Action Buttons - Fixed centering */}
                        <div className="flex gap-1 md:gap-2 ml-2 md:ml-4 flex-shrink-0">
                          <button
                            onClick={() => handleFollow(post.id)}
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
                              <span>Asked {formatTimeAgo(post.createdAt)}</span>
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
              ))
            )}
          </div>

          {/* Load More Button */}
          {filteredPosts.length > 0 && (
            <div className="text-center mt-8">
              <button className="bg-kawaii-purple hover:bg-kawaii-purple-dark text-gray-700 font-bold py-3 px-6 md:px-8 rounded-kawaii transition-all duration-300 hover:scale-105 w-full sm:w-auto">
                Load More Discussions
              </button>
            </div>
          )}

          {/* Community Stats */}
          <div className="mt-12 md:mt-16 bg-white/80 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-purple/30 p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">PawBackHome Community Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-kawaii-purple/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users size={20} className="text-kawaii-purple-dark md:w-6 md:h-6" />
                </div>
                <div className="text-xl md:text-2xl font-bold text-gray-800">12,847</div>
                <div className="text-xs md:text-sm text-gray-600">Active Members</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-kawaii-blue/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircle size={20} className="text-kawaii-blue-dark md:w-6 md:h-6" />
                </div>
                <div className="text-xl md:text-2xl font-bold text-gray-800">4,156</div>
                <div className="text-xs md:text-sm text-gray-600">Total Discussions</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-kawaii-green/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle size={20} className="text-kawaii-green-dark md:w-6 md:h-6" />
                </div>
                <div className="text-xl md:text-2xl font-bold text-gray-800">3,892</div>
                <div className="text-xs md:text-sm text-gray-600">Solved Questions</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-kawaii-yellow/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Home size={20} className="text-kawaii-yellow-dark md:w-6 md:h-6" />
                </div>
                <div className="text-xl md:text-2xl font-bold text-gray-800">2,341</div>
                <div className="text-xs md:text-sm text-gray-600">Paws Sent Home</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;