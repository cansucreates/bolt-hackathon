export interface ForumPost {
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

export interface Comment {
  id: string;
  post_id: string;
  parent_id: string | null;
  author_id: string;
  author_name: string;
  content: string;
  created_at: string;
  updated_at: string;
  like_count?: number;
  author_avatar?: string;
  author_badge?: string;
  isLiked?: boolean;
  replies?: Comment[];
  isEditing?: boolean;
}

export interface CommentLike {
  id: string;
  comment_id: string;
  user_id: string;
  created_at: string;
}

export interface CommentFormData {
  content: string;
  post_id: string;
  parent_id?: string | null;
}