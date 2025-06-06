import React, { useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useVideoStore } from '../store/videoStore';
import VideoPlayer from './VideoPlayer';
import VideoOverlay from './VideoOverlay';
import InfoDrawer from './InfoDrawer';

const VideoFeed = () => {
  const { videos, currentVideoIndex, setCurrentVideo } = useVideoStore();
  const containerRef = useRef(null);
  const isScrolling = useRef(false);

  // Handle scroll to change videos
  const handleScroll = (e) => {
    if (isScrolling.current) return;
    
    const container = e.target;
    const scrollTop = container.scrollTop;
    const videoHeight = window.innerHeight;
    const newIndex = Math.round(scrollTop / videoHeight);
    
    if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < videos.length) {
      setCurrentVideo(newIndex);
    }
  };

  // Handle wheel events for smoother scrolling
  const handleWheel = (e) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container || isScrolling.current) return;

    const delta = e.deltaY;
    const threshold = 50;

    if (Math.abs(delta) > threshold) {
      const newIndex = delta > 0 
        ? Math.min(currentVideoIndex + 1, videos.length - 1)
        : Math.max(currentVideoIndex - 1, 0);
      
      if (newIndex !== currentVideoIndex) {
        navigateToVideo(newIndex);
      }
    }
  };

  // Navigate to specific video with smooth scrolling
  const navigateToVideo = (index) => {
    const container = containerRef.current;
    if (!container) return;

    isScrolling.current = true;
    setCurrentVideo(index);
    
    container.scrollTo({
      top: index * window.innerHeight,
      behavior: 'smooth'
    });

    setTimeout(() => {
      isScrolling.current = false;
    }, 600);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' && currentVideoIndex > 0) {
        e.preventDefault();
        navigateToVideo(currentVideoIndex - 1);
      } else if (e.key === 'ArrowDown' && currentVideoIndex < videos.length - 1) {
        e.preventDefault();
        navigateToVideo(currentVideoIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentVideoIndex, videos.length]);

  // Handle touch gestures for mobile
  const touchStart = useRef(null);
  const touchEnd = useRef(null);

  const handleTouchStart = (e) => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientY;
  };

  const handleTouchMove = (e) => {
    touchEnd.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    
    const distance = touchStart.current - touchEnd.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance && currentVideoIndex < videos.length - 1) {
      // Swipe up - next video
      navigateToVideo(currentVideoIndex + 1);
    } else if (distance < -minSwipeDistance && currentVideoIndex > 0) {
      // Swipe down - previous video
      navigateToVideo(currentVideoIndex - 1);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <div
        ref={containerRef}
        className="h-full overflow-y-auto snap-y snap-mandatory"
        onScroll={handleScroll}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitScrollbar: { display: 'none' }
        }}
      >
        {videos.map((video, index) => (
          <div
            key={video.id}
            className="relative w-full h-screen snap-start snap-always"
          >
            <VideoPlayer
              video={video}
              isActive={index === currentVideoIndex}
            />
            <VideoOverlay video={video} />
          </div>
        ))}
      </div>

      {/* Navigation Indicators */}
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col gap-2">
        {/* Up Arrow */}
        {currentVideoIndex > 0 && (
          <button
            onClick={() => navigateToVideo(currentVideoIndex - 1)}
            className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
            aria-label="Previous video"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        )}
        
        {/* Video Indicators */}
        <div className="flex flex-col gap-1">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => navigateToVideo(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentVideoIndex 
                  ? 'bg-white' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Go to video ${index + 1}`}
            />
          ))}
        </div>

        {/* Down Arrow */}
        {currentVideoIndex < videos.length - 1 && (
          <button
            onClick={() => navigateToVideo(currentVideoIndex + 1)}
            className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
            aria-label="Next video"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Video Counter */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-medium">
        {currentVideoIndex + 1} / {videos.length}
      </div>

      {/* Instructions for desktop */}
      <div className="absolute bottom-4 left-4 text-white text-xs opacity-75 hidden md:block">
        Use ↑↓ arrow keys or scroll to navigate
      </div>

      {/* Info Drawer */}
      <InfoDrawer />
    </div>
  );
};

export default VideoFeed;