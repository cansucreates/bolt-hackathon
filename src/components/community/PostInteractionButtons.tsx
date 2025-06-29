import React, { useState } from 'react';
import { Heart, Share2, Bookmark, Flag } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface PostInteractionButtonsProps {
  postId: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
  onLike?: () => void;
  onBookmark?: () => void;
  onShare?: () => void;
  onReport?: () => void;
}

const PostInteractionButtons: React.FC<PostInteractionButtonsProps> = ({
  postId,
  isLiked = false,
  isBookmarked = false,
  onLike,
  onBookmark,
  onShare,
  onReport
}) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(isLiked);
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const handleLike = () => {
    if (!user) return;
    setLiked(!liked);
    if (onLike) onLike();
  };

  const handleBookmark = () => {
    if (!user) return;
    setBookmarked(!bookmarked);
    if (onBookmark) onBookmark();
  };

  const handleShare = () => {
    // Copy the URL to clipboard
    const url = `${window.location.origin}/community/post/${postId}`;
    navigator.clipboard.writeText(url);
    
    // Show a toast or alert
    alert('Link copied to clipboard!');
    
    if (onShare) onShare();
  };

  const handleReport = () => {
    if (!user) return;
    if (onReport) onReport();
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleLike}
        disabled={!user}
        className={`p-2 rounded-full transition-colors duration-200 ${
          liked 
            ? 'bg-kawaii-pink/20 text-kawaii-pink-dark' 
            : 'hover:bg-kawaii-pink/20 text-gray-500'
        }`}
        title={liked ? 'Unlike' : 'Like'}
      >
        <Heart size={18} className={liked ? 'fill-kawaii-pink-dark' : ''} />
      </button>
      
      <button
        onClick={handleShare}
        className="p-2 hover:bg-kawaii-blue/20 rounded-full transition-colors duration-200"
        title="Share"
      >
        <Share2 size={18} className="text-kawaii-blue-dark" />
      </button>
      
      <button
        onClick={handleBookmark}
        disabled={!user}
        className={`p-2 rounded-full transition-colors duration-200 ${
          bookmarked 
            ? 'bg-kawaii-yellow/20 text-kawaii-yellow-dark' 
            : 'hover:bg-kawaii-yellow/20 text-gray-500'
        }`}
        title={bookmarked ? 'Bookmarked' : 'Bookmark'}
      >
        <Bookmark size={18} className={bookmarked ? 'fill-kawaii-yellow-dark' : ''} />
      </button>
      
      <button
        onClick={handleReport}
        disabled={!user}
        className="p-2 hover:bg-red-100 rounded-full transition-colors duration-200"
        title="Report"
      >
        <Flag size={18} className="text-gray-500" />
      </button>
    </div>
  );
};

export default PostInteractionButtons;