import type {
  IPost,
  IComment,
  ILike,
  IHashtag,
  ICreatePostRequest,
  ICreateCommentRequest,
  IPagedResponse,
} from '../types';
import { USE_MOCK, POSTS_PER_PAGE } from '../constants/apiEndpoints';
import {
  MOCK_POSTS,
  MOCK_COMMENTS,
  MOCK_HASHTAGS,
  MOCK_USERS,
  MOCK_MEDIA,
} from '../mock/mockData';
import { postAxios } from './axiosConfig';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
let nextPostId = MOCK_POSTS.length + 1;
let nextCommentId = MOCK_COMMENTS.length + 1;

export const postService = {
  // ── FEED ──
  getFeed: async (page = 0): Promise<IPagedResponse<IPost>> => {
    if (USE_MOCK) {
      await delay(500);
      const public_posts = MOCK_POSTS.filter((p) => p.privacy === 'PUBLIC').sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const start = page * POSTS_PER_PAGE;
      const content = public_posts.slice(start, start + POSTS_PER_PAGE);
      return {
        content,
        total_elements: public_posts.length,
        total_pages: Math.ceil(public_posts.length / POSTS_PER_PAGE),
        current_page: page,
        page_size: POSTS_PER_PAGE,
        is_last: start + POSTS_PER_PAGE >= public_posts.length,
      };
    }
    const res = await postAxios.get(API_ENDPOINTS.POST.FEED, { params: { page } });
    return res.data.data;
  },

  // ── GET ALL POSTS ──
  getAllPosts: async (page = 0): Promise<IPagedResponse<IPost>> => {
    if (USE_MOCK) {
      await delay(400);
      const sorted = [...MOCK_POSTS].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      return {
        content: sorted.slice(page * POSTS_PER_PAGE, (page + 1) * POSTS_PER_PAGE),
        total_elements: sorted.length,
        total_pages: Math.ceil(sorted.length / POSTS_PER_PAGE),
        current_page: page,
        page_size: POSTS_PER_PAGE,
        is_last: (page + 1) * POSTS_PER_PAGE >= sorted.length,
      };
    }
    const res = await postAxios.get(API_ENDPOINTS.POST.GET_ALL, { params: { page } });
    return res.data.data;
  },

  // ── GET POST BY ID ──
  getPostById: async (postId: number): Promise<IPost> => {
    if (USE_MOCK) {
      await delay(300);
      const post = MOCK_POSTS.find((p) => p.id === postId);
      if (!post) throw new Error('Post not found');
      return post;
    }
    const res = await postAxios.get(API_ENDPOINTS.POST.GET_BY_ID(postId));
    return res.data.data;
  },

  // ── GET USER POSTS ──
  getUserPosts: async (userId: number): Promise<IPost[]> => {
    if (USE_MOCK) {
      await delay(300);
      return MOCK_POSTS.filter((p) => p.user_id === userId).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    const res = await postAxios.get(API_ENDPOINTS.POST.GET_BY_USER(userId));
    return res.data.data;
  },

  // ── CREATE POST ──
  createPost: async (data: ICreatePostRequest): Promise<IPost> => {
    if (USE_MOCK) {
      await delay(1000);
      const user = MOCK_USERS.find((u) => u.id === data.user_id);
      const newPost: IPost = {
        id: nextPostId++,
        user_id: data.user_id,
        caption: data.caption,
        privacy: data.privacy,
        like_count: 0,
        comment_count: 0,
        is_trending_candidate: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user,
        media: data.media_files.map((file, idx) => ({
          id: MOCK_MEDIA.length + idx + 1,
          post_id: nextPostId - 1,
          media_type: file.type.startsWith('video') ? 'VIDEO' : 'IMAGE',
          media_blob: null,
          display_order: idx + 1,
          preview_url: URL.createObjectURL(file),
        })),
        hashtags: data.hashtags
          .map((tag) => MOCK_HASHTAGS.find((h) => h.tag === tag))
          .filter(Boolean) as typeof MOCK_HASHTAGS,
        is_liked_by_me: false,
      };
      MOCK_POSTS.unshift(newPost);
      return newPost;
    }
    const formData = new FormData();
    formData.append('user_id', String(data.user_id));
    formData.append('caption', data.caption);
    formData.append('privacy', data.privacy);
    formData.append('hashtags', JSON.stringify(data.hashtags));
    if (data.allowed_user_ids)
      formData.append('allowed_user_ids', JSON.stringify(data.allowed_user_ids));
    data.media_files.forEach((file) => formData.append('media_files', file));
    const res = await postAxios.post(API_ENDPOINTS.POST.CREATE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  // ── DELETE POST ──
  deletePost: async (postId: number): Promise<void> => {
    if (USE_MOCK) {
      await delay(400);
      const idx = MOCK_POSTS.findIndex((p) => p.id === postId);
      if (idx !== -1) MOCK_POSTS.splice(idx, 1);
      return;
    }
    await postAxios.delete(API_ENDPOINTS.POST.DELETE(postId));
  },

  // ── TOGGLE LIKE ──
  toggleLike: async (postId: number, userId: number, isLiked: boolean): Promise<void> => {
    if (USE_MOCK) {
      await delay(200);
      const post = MOCK_POSTS.find((p) => p.id === postId);
      if (post) {
        post.is_liked_by_me = !isLiked;
        post.like_count += isLiked ? -1 : 1;
      }
      return;
    }
    if (isLiked) {
      await postAxios.delete(API_ENDPOINTS.POST.UNLIKE(postId), {
        data: { user_id: userId },
      });
    } else {
      await postAxios.post(API_ENDPOINTS.POST.LIKE(postId), { user_id: userId });
    }
  },

  // ── GET LIKES ──
  getLikedUsers: async (postId: number): Promise<ILike[]> => {
    if (USE_MOCK) {
      await delay(300);
      return MOCK_USERS.slice(0, 3).map((u) => ({
        user_id: u.id,
        post_id: postId,
        created_at: new Date().toISOString(),
        user: u,
      }));
    }
    const res = await postAxios.get(API_ENDPOINTS.POST.GET_LIKED_USERS(postId));
    return res.data.data;
  },

  // ── GET COMMENTS ──
  getComments: async (postId: number): Promise<IComment[]> => {
    if (USE_MOCK) {
      await delay(300);
      return MOCK_COMMENTS.filter((c) => c.post_id === postId);
    }
    const res = await postAxios.get(API_ENDPOINTS.POST.GET_COMMENTS(postId));
    return res.data.data;
  },

  // ── ADD COMMENT ──
  addComment: async (data: ICreateCommentRequest): Promise<IComment> => {
    if (USE_MOCK) {
      await delay(400);
      const user = MOCK_USERS.find((u) => u.id === data.user_id);
      const comment: IComment = {
        id: nextCommentId++,
        user_id: data.user_id,
        post_id: data.post_id,
        content: data.content,
        created_at: new Date().toISOString(),
        user,
      };
      MOCK_COMMENTS.push(comment);
      const post = MOCK_POSTS.find((p) => p.id === data.post_id);
      if (post) post.comment_count++;
      return comment;
    }
    const res = await postAxios.post(
      API_ENDPOINTS.POST.ADD_COMMENT(data.post_id),
      data
    );
    return res.data.data;
  },

  // ── DELETE COMMENT ──
  deleteComment: async (postId: number, commentId: number): Promise<void> => {
    if (USE_MOCK) {
      await delay(300);
      const idx = MOCK_COMMENTS.findIndex((c) => c.id === commentId);
      if (idx !== -1) MOCK_COMMENTS.splice(idx, 1);
      const post = MOCK_POSTS.find((p) => p.id === postId);
      if (post && post.comment_count > 0) post.comment_count--;
      return;
    }
    await postAxios.delete(API_ENDPOINTS.POST.DELETE_COMMENT(postId, commentId));
  },

  // ── SEARCH HASHTAGS ──
  searchHashtags: async (query: string): Promise<IHashtag[]> => {
    if (USE_MOCK) {
      await delay(200);
      const q = query.toLowerCase().replace('#', '');
      return MOCK_HASHTAGS.filter((h) => h.tag.includes(q));
    }
    const res = await postAxios.get(API_ENDPOINTS.POST.SEARCH_HASHTAGS, {
      params: { q: query },
    });
    return res.data.data;
  },

  // ── GET ALL HASHTAGS ──
  getAllHashtags: async (): Promise<IHashtag[]> => {
    if (USE_MOCK) {
      await delay(200);
      return MOCK_HASHTAGS;
    }
    const res = await postAxios.get(API_ENDPOINTS.POST.GET_HASHTAGS);
    return res.data.data;
  },
};
