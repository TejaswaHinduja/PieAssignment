
import React, { useEffect } from 'react';
import { X, Heart, MessageCircle, Share2 } from 'lucide-react';
import { useVideoStore } from '../store/videoStore';

const InfoDrawer = () => {
  const { isDrawerOpen, selectedVideo, interactions, closeDrawer } = useVideoStore();

  // Close drawer on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isDrawerOpen, closeDrawer]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen || !selectedVideo) return null;

  const formatCount = (count) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  const isLiked = interactions[selectedVideo.id]?.liked || false;
  const extraShares = interactions[selectedVideo.id]?.shares || 0;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={closeDrawer}
      />
      
      {/* Drawer */}
      <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
        <div className="bg-white rounded-t-2xl w-full max-w-md mx-4 mb-4 max-h-[85vh] overflow-hidden animate-slide-in-from-bottom pointer-events-auto shadow-2xl">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
            <h2 className="text-lg font-semibold text-gray-900">Video Details</h2>
            <button
              onClick={closeDrawer}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto">
            {/* Thumbnail */}
            <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
              <img
                src={selectedVideo.thumbnail}
                alt={selectedVideo.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Creator Info */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {selectedVideo.creator.charAt(1).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {selectedVideo.title}
                </h3>
                <p className="text-gray-600 text-sm">{selectedVideo.creator}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {selectedVideo.description}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Heart className={`w-4 h-4 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                  <span className="font-semibold text-gray-900">
                    {formatCount(selectedVideo.likes + (isLiked ? 1 : 0))}
                  </span>
                </div>
                <p className="text-gray-600 text-xs">Likes</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <MessageCircle className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold text-gray-900">
                    {formatCount(selectedVideo.comments)}
                  </span>
                </div>
                <p className="text-gray-600 text-xs">Comments</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Share2 className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold text-gray-900">
                    {formatCount(selectedVideo.shares + extraShares)}
                  </span>
                </div>
                <p className="text-gray-600 text-xs">Shares</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-xs text-center">
                Tap outside or press ESC to close
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoDrawer;