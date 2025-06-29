import { supabase } from './supabase';
import { Comment, CommentFormData, CommentLike } from '../types/community';

/**
 * Fetch comments for a specific post
 */
export const fetchComments = async (postId: string): Promise<{ data?: Comment[]; error?: string }> => {
  try {
    // First, fetch all comments for the post
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        comment_likes(*)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      return { error: 'Failed to load comments' };
    }

    // Get current user to check if they liked any comments
    const { data: { user } } = await supabase.auth.getUser();

    // Process comments to include like status and author info
    const processedComments = await Promise.all(data.map(async (comment) => {
      // Get author info
      const { data: authorData } = await supabase
        .from('users')
        .select('avatar_url, user_name')
        .eq('id', comment.author_id)
        .single();

      // Check if current user liked this comment
      const isLiked = user ? comment.comment_likes.some((like: any) => like.user_id === user.id) : false;
      
      return {
        ...comment,
        like_count: comment.comment_likes.length,
        isLiked,
        author_avatar: authorData?.avatar_url || null,
        // Remove the raw comment_likes array as we've processed it
        comment_likes: undefined
      };
    }));

    // Organize comments into a tree structure (top-level comments and their replies)
    const topLevelComments: Comment[] = [];
    const commentMap = new Map<string, Comment>();

    // First pass: create a map of all comments
    processedComments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: organize into parent-child relationships
    processedComments.forEach(comment => {
      const processedComment = commentMap.get(comment.id)!;
      
      if (comment.parent_id) {
        // This is a reply, add it to its parent's replies
        const parentComment = commentMap.get(comment.parent_id);
        if (parentComment) {
          parentComment.replies = [...(parentComment.replies || []), processedComment];
        }
      } else {
        // This is a top-level comment
        topLevelComments.push(processedComment);
      }
    });

    return { data: topLevelComments };
  } catch (error) {
    console.error('Error in fetchComments:', error);
    return { error: 'An unexpected error occurred while loading comments' };
  }
};

/**
 * Add a new comment
 */
export const addComment = async (commentData: CommentFormData): Promise<{ data?: Comment; error?: string }> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { error: 'You must be logged in to comment' };
    }

    // Get user profile to get the name
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('user_name')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return { error: 'Failed to fetch user profile' };
    }

    // Create the comment
    const { data, error } = await supabase
      .from('comments')
      .insert([{
        post_id: commentData.post_id,
        parent_id: commentData.parent_id || null,
        author_id: user.id,
        author_name: profile.user_name || user.email,
        content: commentData.content
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding comment:', error);
      return { error: 'Failed to add comment' };
    }

    return { data };
  } catch (error) {
    console.error('Error in addComment:', error);
    return { error: 'An unexpected error occurred while adding your comment' };
  }
};

/**
 * Update an existing comment
 */
export const updateComment = async (commentId: string, content: string): Promise<{ data?: Comment; error?: string }> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { error: 'You must be logged in to update a comment' };
    }

    // Check if user owns the comment
    const { data: comment, error: fetchError } = await supabase
      .from('comments')
      .select('*')
      .eq('id', commentId)
      .eq('author_id', user.id)
      .single();

    if (fetchError || !comment) {
      return { error: 'Comment not found or you do not have permission to edit it' };
    }

    // Update the comment
    const { data, error } = await supabase
      .from('comments')
      .update({ content })
      .eq('id', commentId)
      .select()
      .single();

    if (error) {
      console.error('Error updating comment:', error);
      return { error: 'Failed to update comment' };
    }

    return { data };
  } catch (error) {
    console.error('Error in updateComment:', error);
    return { error: 'An unexpected error occurred while updating your comment' };
  }
};

/**
 * Delete a comment
 */
export const deleteComment = async (commentId: string): Promise<{ success?: boolean; error?: string }> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { error: 'You must be logged in to delete a comment' };
    }

    // Check if user owns the comment
    const { data: comment, error: fetchError } = await supabase
      .from('comments')
      .select('*')
      .eq('id', commentId)
      .eq('author_id', user.id)
      .single();

    if (fetchError || !comment) {
      return { error: 'Comment not found or you do not have permission to delete it' };
    }

    // Delete the comment
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      console.error('Error deleting comment:', error);
      return { error: 'Failed to delete comment' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in deleteComment:', error);
    return { error: 'An unexpected error occurred while deleting your comment' };
  }
};

/**
 * Like or unlike a comment
 */
export const toggleCommentLike = async (commentId: string): Promise<{ success?: boolean; liked?: boolean; error?: string }> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { error: 'You must be logged in to like a comment' };
    }

    // Check if user already liked the comment
    const { data: existingLike, error: likeError } = await supabase
      .from('comment_likes')
      .select('*')
      .eq('comment_id', commentId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (likeError) {
      console.error('Error checking like status:', likeError);
      return { error: 'Failed to check like status' };
    }

    if (existingLike) {
      // User already liked the comment, so unlike it
      const { error: unlikeError } = await supabase
        .from('comment_likes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', user.id);

      if (unlikeError) {
        console.error('Error unliking comment:', unlikeError);
        return { error: 'Failed to unlike comment' };
      }

      return { success: true, liked: false };
    } else {
      // User hasn't liked the comment yet, so like it
      const { error: likeError } = await supabase
        .from('comment_likes')
        .insert([{
          comment_id: commentId,
          user_id: user.id
        }]);

      if (likeError) {
        console.error('Error liking comment:', likeError);
        return { error: 'Failed to like comment' };
      }

      return { success: true, liked: true };
    }
  } catch (error) {
    console.error('Error in toggleCommentLike:', error);
    return { error: 'An unexpected error occurred while processing your like' };
  }
};

/**
 * Get like count for a comment
 */
export const getCommentLikeCount = async (commentId: string): Promise<{ count?: number; error?: string }> => {
  try {
    const { count, error } = await supabase
      .from('comment_likes')
      .select('*', { count: 'exact', head: true })
      .eq('comment_id', commentId);

    if (error) {
      console.error('Error getting comment like count:', error);
      return { error: 'Failed to get like count' };
    }

    return { count: count || 0 };
  } catch (error) {
    console.error('Error in getCommentLikeCount:', error);
    return { error: 'An unexpected error occurred while getting like count' };
  }
};