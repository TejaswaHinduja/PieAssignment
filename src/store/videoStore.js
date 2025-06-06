import { create } from 'zustand';
import { videoData } from '../data/videoData';

export const useVideoStore = create((set, get) => ({
  // State
  videos: videoData,
  currentVideoIndex: 0,
  isDrawerOpen: false,
  selectedVideo: null,
  interactions: {},

  // Actions
  setCurrentVideo: (index) => set({ currentVideoIndex: index }),
  
  openDrawer: (video) => set({ 
    isDrawerOpen: true, 
    selectedVideo: video 
  }),
  
  closeDrawer: () => set({ 
    isDrawerOpen: false, 
    selectedVideo: null 
  }),
  
  toggleLike: (videoId) => set((state) => ({
    interactions: {
      ...state.interactions,
      [videoId]: {
        ...state.interactions[videoId],
        liked: !state.interactions[videoId]?.liked
      }
    }
  })),
  
  incrementShare: (videoId) => set((state) => ({
    interactions: {
      ...state.interactions,
      [videoId]: {
        ...state.interactions[videoId],
        shares: (state.interactions[videoId]?.shares || 0) + 1
      }
    }
  }))
}));