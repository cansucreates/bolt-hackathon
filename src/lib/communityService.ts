import { supabase } from './supabase';
import { ForumPost } from '../types/community';

/**
 * Create a new forum post
 */
export const createPost = async (postData: {
  title: string;
  content: string;
  category: string;
  tags: string[];
  imageFile?: File | null;
}): Promise<{ data?: ForumPost; error?: string }> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { error: 'You must be logged in to create a post' };
    }

    // Get user profile to get the name
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('user_name, avatar_url')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return { error: 'Failed to fetch user profile' };
    }

    // Upload image if provided
    let imageUrl = null;
    if (postData.imageFile) {
      const fileName = `${Date.now()}-${postData.imageFile.name.replace(/\s+/g, '-')}`;
      const filePath = `${user.id}/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(filePath, postData.imageFile);
      
      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return { error: 'Failed to upload image' };
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath);
      
      imageUrl = publicUrl;
    }

    // In a real implementation, this would insert into a 'posts' table
    // For now, we'll return a mock post object
    const mockPost: ForumPost = {
      id: `post_${Date.now()}`,
      title: postData.title,
      content: postData.content,
      author: {
        id: user.id,
        name: profile.user_name || user.email?.split('@')[0] || 'Anonymous',
        avatar: profile.avatar_url || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
        reputation: 1,
      },
      category: postData.category,
      tags: postData.tags,
      replies: 0,
      views: 0,
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      hasImages: !!imageUrl
    };

    console.log('Created post:', mockPost);

    return { data: mockPost };
  } catch (error) {
    console.error('Error creating post:', error);
    return { error: 'An unexpected error occurred while creating your post' };
  }
};

/**
 * Vote on a post (upvote or downvote)
 */
export const voteOnPost = async (
  postId: string,
  voteType: 'up' | 'down'
): Promise<{ success?: boolean; error?: string }> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { error: 'You must be logged in to vote' };
    }

    // Check if user has already voted on this post
    const { data: existingVote, error: voteError } = await supabase
      .from('post_votes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (voteError) {
      console.error('Error checking vote status:', voteError);
      return { error: 'Failed to check vote status' };
    }

    // In a real implementation, this would update a 'post_votes' table
    // For now, we'll just return success
    return { success: true };
  } catch (error) {
    console.error('Error voting on post:', error);
    return { error: 'An unexpected error occurred while processing your vote' };
  }
};

/**
 * Get posts with filtering and sorting
 */
export const getPosts = async (options: {
  category?: string;
  searchQuery?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}): Promise<{ data?: ForumPost[]; error?: string }> => {
  try {
    // In a real implementation, this would query a 'posts' table
    // For now, we'll return mock data
    return { data: [] };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { error: 'An unexpected error occurred while fetching posts' };
  }
};