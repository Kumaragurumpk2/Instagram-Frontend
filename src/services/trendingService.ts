import type { ITrendingPost, ITrendingHashtag } from '../types';
import { USE_MOCK } from '../constants/apiEndpoints';
import { MOCK_TRENDING_POSTS, MOCK_TRENDING_HASHTAGS } from '../mock/mockData';
import { trendingAxios } from './axiosConfig';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const trendingService = {
  // ── TRENDING POSTS ──
  getTrendingPosts: async (): Promise<ITrendingPost[]> => {
    if (USE_MOCK) {
      await delay(400);
      return [...MOCK_TRENDING_POSTS].sort((a, b) => b.score - a.score);
    }
    const res = await trendingAxios.get(API_ENDPOINTS.TRENDING.TRENDING_POSTS);
    return res.data.data;
  },

  // ── TRENDING HASHTAGS ──
  getTrendingHashtags: async (): Promise<ITrendingHashtag[]> => {
    if (USE_MOCK) {
      await delay(300);
      return [...MOCK_TRENDING_HASHTAGS].sort((a, b) => b.score - a.score);
    }
    const res = await trendingAxios.get(API_ENDPOINTS.TRENDING.TRENDING_HASHTAGS);
    return res.data.data;
  },
};
