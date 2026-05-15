// ================================================================
// API ENDPOINT CONSTANTS — per microservice
// ================================================================

const AUTH_BASE = import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:8081/api';
const POST_BASE = import.meta.env.VITE_POST_SERVICE_URL || 'http://localhost:8082/api';
const FOLLOW_BASE = import.meta.env.VITE_FOLLOW_SERVICE_URL || 'http://localhost:8083/api';
const TRENDING_BASE = import.meta.env.VITE_TRENDING_SERVICE_URL || 'http://localhost:8084/api';

export const API_ENDPOINTS = {
  // ── AUTH SERVICE ──
  AUTH: {
    BASE: AUTH_BASE,
    REGISTER: `${AUTH_BASE}/auth/register`,
    LOGIN: `${AUTH_BASE}/auth/login`,
    LOGOUT: `${AUTH_BASE}/auth/logout`,
    REFRESH: `${AUTH_BASE}/auth/refresh`,
    FORGOT_PASSWORD: `${AUTH_BASE}/auth/forgot-password`,
    RESET_PASSWORD: `${AUTH_BASE}/auth/reset-password`,
    VERIFY_TOKEN: `${AUTH_BASE}/auth/verify-token`,
    PROFILE: (userId: number) => `${AUTH_BASE}/users/${userId}`,
    UPDATE_PROFILE: (userId: number) => `${AUTH_BASE}/users/${userId}`,
    UPLOAD_AVATAR: (userId: number) => `${AUTH_BASE}/users/${userId}/avatar`,
    SEARCH_USERS: `${AUTH_BASE}/users/search`,
    GET_ALL_USERS: `${AUTH_BASE}/users`,
  },

  // ── POST SERVICE ──
  POST: {
    BASE: POST_BASE,
    CREATE: `${POST_BASE}/posts`,
    GET_ALL: `${POST_BASE}/posts`,
    GET_BY_ID: (postId: number) => `${POST_BASE}/posts/${postId}`,
    GET_BY_USER: (userId: number) => `${POST_BASE}/posts/user/${userId}`,
    UPDATE: (postId: number) => `${POST_BASE}/posts/${postId}`,
    DELETE: (postId: number) => `${POST_BASE}/posts/${postId}`,
    FEED: `${POST_BASE}/posts/feed`,

    // Media
    UPLOAD_MEDIA: (postId: number) => `${POST_BASE}/posts/${postId}/media`,
    GET_MEDIA: (postId: number) => `${POST_BASE}/posts/${postId}/media`,

    // Comments
    GET_COMMENTS: (postId: number) => `${POST_BASE}/posts/${postId}/comments`,
    ADD_COMMENT: (postId: number) => `${POST_BASE}/posts/${postId}/comments`,
    DELETE_COMMENT: (postId: number, commentId: number) =>
      `${POST_BASE}/posts/${postId}/comments/${commentId}`,

    // Likes
    LIKE: (postId: number) => `${POST_BASE}/posts/${postId}/likes`,
    UNLIKE: (postId: number) => `${POST_BASE}/posts/${postId}/likes`,
    GET_LIKED_USERS: (postId: number) => `${POST_BASE}/posts/${postId}/likes/users`,
    IS_LIKED: (postId: number, userId: number) =>
      `${POST_BASE}/posts/${postId}/likes/${userId}`,

    // Hashtags
    GET_HASHTAGS: `${POST_BASE}/hashtags`,
    SEARCH_HASHTAGS: `${POST_BASE}/hashtags/search`,

    // Allowed users
    GET_ALLOWED_USERS: (postId: number) => `${POST_BASE}/posts/${postId}/allowed-users`,
    UPDATE_ALLOWED_USERS: (postId: number) =>
      `${POST_BASE}/posts/${postId}/allowed-users`,
  },

  // ── FOLLOW SERVICE ──
  FOLLOW: {
    BASE: FOLLOW_BASE,
    FOLLOW: `${FOLLOW_BASE}/follow`,
    UNFOLLOW: `${FOLLOW_BASE}/follow`,
    GET_FOLLOWERS: (userId: number) => `${FOLLOW_BASE}/followers/${userId}`,
    GET_FOLLOWING: (userId: number) => `${FOLLOW_BASE}/following/${userId}`,
    IS_FOLLOWING: (userId: number, followingId: number) =>
      `${FOLLOW_BASE}/follow/check?userId=${userId}&followingId=${followingId}`,
    GET_FOLLOW_STATS: (userId: number) => `${FOLLOW_BASE}/stats/${userId}`,
    SUGGESTED_USERS: (userId: number) => `${FOLLOW_BASE}/suggestions/${userId}`,
  },

  // ── TRENDING SERVICE ──
  TRENDING: {
    BASE: TRENDING_BASE,
    TRENDING_POSTS: `${TRENDING_BASE}/trending/posts`,
    TRENDING_HASHTAGS: `${TRENDING_BASE}/trending/hashtags`,
    POST_SCORE: (postId: number) => `${TRENDING_BASE}/trending/posts/${postId}`,
    HASHTAG_SCORE: (hashtagId: number) =>
      `${TRENDING_BASE}/trending/hashtags/${hashtagId}`,
  },
};

export const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || 'insta_access_token';
export const REFRESH_TOKEN_KEY =
  import.meta.env.VITE_REFRESH_TOKEN_KEY || 'insta_refresh_token';
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'InstaClone';

export const PRIVACY_OPTIONS = [
  { value: 'PUBLIC', label: 'Public', icon: 'globe' },
  { value: 'FRIENDS', label: 'Friends', icon: 'people-fill' },
  { value: 'PRIVATE', label: 'Only Me', icon: 'lock-fill' },
  { value: 'CUSTOM', label: 'Custom Users', icon: 'person-check-fill' },
] as const;

export const MAX_LOGIN_ATTEMPTS = 5;
export const POSTS_PER_PAGE = 10;
export const COMMENTS_PER_PAGE = 20;
export const USERS_PER_PAGE = 20;
