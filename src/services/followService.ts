import type { IFollower, IUserFollowStats, IUser } from '../types';
import { USE_MOCK } from '../constants/apiEndpoints';
import { MOCK_FOLLOWERS, MOCK_FOLLOW_STATS, MOCK_USERS } from '../mock/mockData';
import { followAxios } from './axiosConfig';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const followService = {
  // ── FOLLOW ──
  follow: async (userId: number, followingId: number): Promise<void> => {
    if (USE_MOCK) {
      await delay(300);
      const exists = MOCK_FOLLOWERS.find(
        (f) => f.user_id === userId && f.following_id === followingId
      );
      if (!exists) {
        MOCK_FOLLOWERS.push({
          user_id: userId,
          following_id: followingId,
          created_at: new Date().toISOString(),
          user: MOCK_USERS.find((u) => u.id === userId),
          following_user: MOCK_USERS.find((u) => u.id === followingId),
        });
        const stats = MOCK_FOLLOW_STATS.find((s) => s.user_id === userId);
        if (stats) stats.following_count++;
        const targetStats = MOCK_FOLLOW_STATS.find((s) => s.user_id === followingId);
        if (targetStats) targetStats.followers_count++;
      }
      return;
    }
    await followAxios.post(API_ENDPOINTS.FOLLOW.FOLLOW, { user_id: userId, following_id: followingId });
  },

  // ── UNFOLLOW ──
  unfollow: async (userId: number, followingId: number): Promise<void> => {
    if (USE_MOCK) {
      await delay(300);
      const idx = MOCK_FOLLOWERS.findIndex(
        (f) => f.user_id === userId && f.following_id === followingId
      );
      if (idx !== -1) {
        MOCK_FOLLOWERS.splice(idx, 1);
        const stats = MOCK_FOLLOW_STATS.find((s) => s.user_id === userId);
        if (stats && stats.following_count > 0) stats.following_count--;
        const targetStats = MOCK_FOLLOW_STATS.find((s) => s.user_id === followingId);
        if (targetStats && targetStats.followers_count > 0) targetStats.followers_count--;
      }
      return;
    }
    await followAxios.delete(API_ENDPOINTS.FOLLOW.UNFOLLOW, {
      data: { user_id: userId, following_id: followingId },
    });
  },

  // ── IS FOLLOWING ──
  isFollowing: async (userId: number, followingId: number): Promise<boolean> => {
    if (USE_MOCK) {
      await delay(100);
      return MOCK_FOLLOWERS.some(
        (f) => f.user_id === userId && f.following_id === followingId
      );
    }
    const res = await followAxios.get(
      API_ENDPOINTS.FOLLOW.IS_FOLLOWING(userId, followingId)
    );
    return res.data.data;
  },

  // ── GET FOLLOWERS ──
  getFollowers: async (userId: number): Promise<IFollower[]> => {
    if (USE_MOCK) {
      await delay(300);
      return MOCK_FOLLOWERS.filter((f) => f.following_id === userId);
    }
    const res = await followAxios.get(API_ENDPOINTS.FOLLOW.GET_FOLLOWERS(userId));
    return res.data.data;
  },

  // ── GET FOLLOWING ──
  getFollowing: async (userId: number): Promise<IFollower[]> => {
    if (USE_MOCK) {
      await delay(300);
      return MOCK_FOLLOWERS.filter((f) => f.user_id === userId);
    }
    const res = await followAxios.get(API_ENDPOINTS.FOLLOW.GET_FOLLOWING(userId));
    return res.data.data;
  },

  // ── GET FOLLOW STATS ──
  getFollowStats: async (userId: number): Promise<IUserFollowStats> => {
    if (USE_MOCK) {
      await delay(200);
      const stats = MOCK_FOLLOW_STATS.find((s) => s.user_id === userId);
      return stats || { user_id: userId, followers_count: 0, following_count: 0 };
    }
    const res = await followAxios.get(API_ENDPOINTS.FOLLOW.GET_FOLLOW_STATS(userId));
    return res.data.data;
  },

  // ── SUGGESTED USERS ──
  getSuggestedUsers: async (userId: number): Promise<IUser[]> => {
    if (USE_MOCK) {
      await delay(400);
      const following = MOCK_FOLLOWERS
        .filter((f) => f.user_id === userId)
        .map((f) => f.following_id);
      return MOCK_USERS.filter(
        (u) => u.id !== userId && !following.includes(u.id)
      ).slice(0, 5);
    }
    const res = await followAxios.get(API_ENDPOINTS.FOLLOW.SUGGESTED_USERS(userId));
    return res.data.data;
  },
};
