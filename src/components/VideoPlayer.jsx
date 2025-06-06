import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause } from 'lucide-react';

const VideoPlayer = ({ video, isActive }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive && isPlaying) {
        videoRef.current.play().catch(console.error);
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive, isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadStart = () => setIsLoading(true);
      const handleCanPlay = () => setIsLoading(false);
      
      video.addEventListener('loadstart', handleLoadStart);
      video.addEventListener('canplay', handleCanPlay);
      
      return () => {
        video.removeEventListener('loadstart', handleLoadStart);
        video.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, []);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  return (
    <div className="relative w-full h-full bg-black">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={video.url}
        loop
        muted={isMuted}
        playsInline
        onClick={togglePlay}
        preload="metadata"
      />
      
      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}
      
      {/* Play/Pause Overlay */}
      {!isPlaying && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <button
            onClick={togglePlay}
            className="bg-white bg-opacity-80 rounded-full p-4 hover:bg-opacity-100 transition-all transform hover:scale-105"
          >
            <Play className="w-8 h-8 text-black ml-1" />
          </button>
        </div>
      )}

      {/* Controls Overlay */}
      <div className="absolute top-4 right-4 flex gap-2">
        {/* Mute Button */}
        <button
          onClick={toggleMute}
          className="bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 transition-all"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          <span className="text-sm">{isMuted ? '🔇' : '🔊'}</span>
        </button>
        
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 transition-all"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;