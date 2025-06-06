import React from 'react';
import ActionButtons from './ActionButtons';

const VideoOverlay = ({ video }) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/50 to-transparent">
      <div className="flex justify-between items-end">
        {/* Creator Info */}
        <div className="flex-1 mr-4 max-w-xs sm:max-w-sm md:max-w-md">
          <div className="flex items-center gap-2 mb-2">
            {/* Creator Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {video.creator.charAt(1).toUpperCase()}
              </span>
            </div>
            
            {/* Creator Name */}
            <h3 className="text-white font-semibold text-lg">{video.creator}</h3>
          </div>
          
          {/* Video Title */}
          <p className="text-white text-sm opacity-90 line-clamp-2 leading-relaxed">
            {video.title}
          </p>
          
          {/* Video Description (truncated) */}
          <p className="text-white text-xs opacity-75 mt-1 line-clamp-1">
            {video.description.substring(0, 60)}...
          </p>
        </div>

        {/* Action Buttons */}
        <ActionButtons video={video} />
      </div>
    </div>
  );
};

export default VideoOverlay;