import { supabase } from './supabase';
import { Comment, CommentFormData, CommentLike } from '../types/community';

/**
 * Fetch comments for a specific post
 */
export const fetchComments = async (postId: string): Promise<{ data?: Comment[]; error?: string }> => {
  try {
    console.log('Fetching comments for post:', postId);
    
    // First, fetch all comments for the post
    const { data, error } = await supabase
      .from('comments')
      .select(`
        id,
        post_id,
        parent_id,
        author_id,
        author_name,
        content,
        created_at,
        updated_at
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      return { error: 'Failed to load comments' };
    }

    if (!data || data.length === 0) {
      console.log('No comments found for post:', postId);
      return { data: [] };
    }

    console.log(`Found ${data.length} comments for post:`, postId);

    // Get current user to check if they liked any comments
    const { data: { user } } = await supabase.auth.getUser();
    
    // Get all comment likes in a single query
    const { data: allLikes, error: likesError } = await supabase
      .from('comment_likes')
      .select('*')
      .in('comment_id', data.map(comment => comment.id));
      
    if (likesError) {
      console.error('Error fetching comment likes:', likesError);
      // Continue without likes data
    }

    // Create a map of comment IDs to like counts and user like status
    const likesMap: Record<string, { count: number, isLiked: boolean }> = {};
    
    if (allLikes) {
      allLikes.forEach(like => {
        if (!likesMap[like.comment_id]) {
          likesMap[like.comment_id] = { count: 0, isLiked: false };
        }
        
        likesMap[like.comment_id].count++;
        
        if (user && like.user_id === user.id) {
          likesMap[like.comment_id].isLiked = true;
        }
      });
    }

    // Get all author info in a single query
    const authorIds = [...new Set(data.map(comment => comment.author_id))];
    const { data: authors, error: authorsError } = await supabase
      .from('users')
      .select('id, user_name, avatar_url')
      .in('id', authorIds);
      
    if (authorsError) {
      console.error('Error fetching comment authors:', authorsError);
      // Continue without author data
    }

    // Create a map of author IDs to author info
    const authorsMap: Record<string, { name: string, avatar: string }> = {};
    
    if (authors) {
      authors.forEach(author => {
        authorsMap[author.id] = { 
          name: author.user_name || 'Anonymous', 
          avatar: author.avatar_url || null 
        };
      });
    }

    // Process comments to include like status and author info
    const processedComments: Comment[] = data.map(comment => {
      const likeInfo = likesMap[comment.id] || { count: 0, isLiked: false };
      const authorInfo = authorsMap[comment.author_id] || { name: comment.author_name, avatar: null };
      
      return {
        ...comment,
        like_count: likeInfo.count,
        isLiked: likeInfo.isLiked,
        author_avatar: authorInfo.avatar,
        author_name: authorInfo.name || comment.author_name,
        replies: []
      };
    });

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
        } else {
          // If parent doesn't exist (shouldn't happen with proper DB constraints),
          // treat it as a top-level comment
          topLevelComments.push(processedComment);
        }
      } else {
        // This is a top-level comment
        topLevelComments.push(processedComment);
      }
    });

    console.log(`Processed ${topLevelComments.length} top-level comments with their replies`);
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
    console.log('Adding comment:', commentData);
    
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

    const userName = profile?.user_name || user.email?.split('@')[0] || 'Anonymous';

    // Create the comment
    const { data, error } = await supabase
      .from('comments')
      .insert([{
        post_id: commentData.post_id,
        parent_id: commentData.parent_id || null,
        author_id: user.id,
        author_name: userName,
        content: commentData.content
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding comment:', error);
      return { error: 'Failed to add comment: ' + error.message };
    }

    console.log('Comment added successfully:', data);
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
    console.log('Updating comment:', commentId);
    
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
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', commentId)
      .select()
      .single();

    if (error) {
      console.error('Error updating comment:', error);
      return { error: 'Failed to update comment: ' + error.message };
    }

    console.log('Comment updated successfully:', data);
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
    console.log('Deleting comment:', commentId);
    
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
      return { error: 'Failed to delete comment: ' + error.message };
    }

    console.log('Comment deleted successfully');
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
    console.log('Toggling like for comment:', commentId);
    
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

      console.log('Comment unliked successfully');
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

      console.log('Comment liked successfully');
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