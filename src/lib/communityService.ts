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

    // Create the post in the database
    const { data, error } = await supabase
      .from('forum_posts')
      .insert([{
        user_id: user.id,
        title: postData.title,
        content: postData.content,
        category: postData.category,
        tags: postData.tags,
        image_url: imageUrl
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error);
      return { error: 'Failed to create post: ' + error.message };
    }

    // Format the post for the frontend
    const newPost: ForumPost = {
      id: data.id,
      title: data.title,
      content: data.content,
      author: {
        id: user.id,
        name: profile.user_name || user.email?.split('@')[0] || 'Anonymous',
        avatar: profile.avatar_url || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
        reputation: 1,
      },
      category: data.category,
      tags: data.tags,
      replies: 0,
      views: 0,
      upvotes: 0,
      downvotes: 0,
      createdAt: data.created_at,
      lastActivity: data.created_at,
      hasImages: !!imageUrl
    };

    console.log('Created post:', newPost);

    return { data: newPost };
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

    if (existingVote) {
      // User has already voted, check if it's the same vote type
      if (existingVote.vote_type === voteType) {
        // Remove the vote (toggle off)
        const { error: deleteError } = await supabase
          .from('post_votes')
          .delete()
          .eq('id', existingVote.id);
        
        if (deleteError) {
          console.error('Error removing vote:', deleteError);
          return { error: 'Failed to remove vote' };
        }
      } else {
        // Update the vote type
        const { error: updateError } = await supabase
          .from('post_votes')
          .update({ vote_type: voteType })
          .eq('id', existingVote.id);
        
        if (updateError) {
          console.error('Error updating vote:', updateError);
          return { error: 'Failed to update vote' };
        }
      }
    } else {
      // User hasn't voted yet, create a new vote
      const { error: insertError } = await supabase
        .from('post_votes')
        .insert([{
          post_id: postId,
          user_id: user.id,
          vote_type: voteType
        }]);
      
      if (insertError) {
        console.error('Error creating vote:', insertError);
        return { error: 'Failed to create vote' };
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error voting on post:', error);
    return { error: 'An unexpected error occurred while processing your vote' };
  }
};

/**
 * Follow or unfollow a post
 */
export const togglePostFollow = async (
  postId: string
): Promise<{ success?: boolean; followed?: boolean; error?: string }> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { error: 'You must be logged in to follow posts' };
    }

    // Check if user is already following the post
    const { data: existingFollow, error: followError } = await supabase
      .from('post_follows')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (followError) {
      console.error('Error checking follow status:', followError);
      return { error: 'Failed to check follow status' };
    }

    if (existingFollow) {
      // User is already following, unfollow
      const { error: deleteError } = await supabase
        .from('post_follows')
        .delete()
        .eq('id', existingFollow.id);
      
      if (deleteError) {
        console.error('Error unfollowing post:', deleteError);
        return { error: 'Failed to unfollow post' };
      }

      return { success: true, followed: false };
    } else {
      // User isn't following yet, follow
      const { error: insertError } = await supabase
        .from('post_follows')
        .insert([{
          post_id: postId,
          user_id: user.id
        }]);
      
      if (insertError) {
        console.error('Error following post:', insertError);
        return { error: 'Failed to follow post' };
      }

      return { success: true, followed: true };
    }
  } catch (error) {
    console.error('Error toggling post follow:', error);
    return { error: 'An unexpected error occurred while processing your request' };
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
    let query = supabase
      .from('forum_posts')
      .select(`
        *,
        users!forum_posts_user_id_fkey (
          id,
          user_name,
          avatar_url
        ),
        post_votes (
          id,
          vote_type
        ),
        post_follows (
          id
        )
      `);

    // Apply category filter
    if (options.category && options.category !== 'all') {
      query = query.eq('category', options.category);
    }

    // Apply search filter
    if (options.searchQuery) {
      query = query.or(`title.ilike.%${options.searchQuery}%,content.ilike.%${options.searchQuery}%`);
    }

    // Apply sorting
    if (options.sortBy) {
      switch (options.sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'popular':
          // This would ideally use a more complex query with vote counts
          query = query.order('view_count', { ascending: false });
          break;
        case 'unanswered':
          // This would ideally check for posts with no comments
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    const page = options.page || 1;
    const limit = options.limit || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    query = query.range(from, to);

    // Execute query
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching posts:', error);
      return { error: 'Failed to fetch posts' };
    }

    // Get current user to check if they've voted or followed
    const { data: { user } } = await supabase.auth.getUser();

    // Format posts for the frontend
    const formattedPosts: ForumPost[] = data.map(post => {
      // Count votes
      const upvotes = post.post_votes.filter((vote: any) => vote.vote_type === 'up').length;
      const downvotes = post.post_votes.filter((vote: any) => vote.vote_type === 'down').length;
      
      // Check if user has followed this post
      const isFollowing = user ? post.post_follows.some((follow: any) => follow.user_id === user.id) : false;

      return {
        id: post.id,
        title: post.title,
        content: post.content,
        author: {
          id: post.user_id,
          name: post.users.user_name || 'Anonymous',
          avatar: post.users.avatar_url || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
          reputation: 1, // This would come from a more complex query
          badge: 'New Member' // This would be determined by reputation or other factors
        },
        category: post.category,
        tags: post.tags || [],
        replies: 0, // This would come from a count of comments
        views: post.view_count || 0,
        upvotes,
        downvotes,
        createdAt: post.created_at,
        lastActivity: post.updated_at,
        isPinned: post.is_pinned || false,
        isSolved: post.is_solved || false,
        isFollowing,
        hasImages: !!post.image_url
      };
    });

    return { data: formattedPosts };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { error: 'An unexpected error occurred while fetching posts' };
  }
};