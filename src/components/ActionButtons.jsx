import React from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { useVideoStore } from '../store/videoStore';

const ActionButtons = ({ video }) => {
  const { interactions, toggleLike, incrementShare, openDrawer } = useVideoStore();
  const isLiked = interactions[video.id]?.liked || false;
  const extraShares = interactions[video.id]?.shares || 0;

  const handleShare = () => {
    incrementShare(video.id);
    // In a real app, you'd implement actual sharing functionality
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: `Check out this video by ${video.creator}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        // You could show a toast notification here
        console.log('Link copied to clipboard!');
      }).catch(console.error);
    }
  };

  const formatCount = (count) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Like Button */}
      <button
        onClick={() => toggleLike(video.id)}
        className="flex flex-col items-center gap-1 group"
        aria-label={isLiked ? 'Unlike video' : 'Like video'}
      >
        <div className={`p-3 rounded-full transition-all transform group-hover:scale-110 ${
          isLiked 
            ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' 
            : 'bg-black bg-opacity-50 text-white hover:bg-opacity-70'
        }`}>
          <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
        </div>
        <span className="text-white text-xs font-medium">
          {formatCount(video.likes + (isLiked ? 1 : 0))}
        </span>
      </button>

      {/* Comment Button */}
      <button 
        className="flex flex-col items-center gap-1 group"
        aria-label="View comments"
      >
        <div className="p-3 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all transform group-hover:scale-110">
          <MessageCircle className="w-6 h-6" />
        </div>
        <span className="text-white text-xs font-medium">
          {formatCount(video.comments)}
        </span>
      </button>

      {/* Share Button */}
      <button
        onClick={handleShare}
        className="flex flex-col items-center gap-1 group"
        aria-label="Share video"
      >
        <div className="p-3 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all transform group-hover:scale-110">
          <Share2 className="w-6 h-6" />
        </div>
        <span className="text-white text-xs font-medium">
          {formatCount(video.shares + extraShares)}
        </span>
      </button>

      {/* More Info Button */}
      <button
        onClick={() => openDrawer(video)}
        className="flex flex-col items-center gap-1 group"
        aria-label="More information"
      >
        <div className="p-3 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all transform group-hover:scale-110">
          <MoreHorizontal className="w-6 h-6" />
        </div>
        <span className="text-white text-xs font-medium">More</span>
      </button>
    </div>
  );
};

export default ActionButtons;