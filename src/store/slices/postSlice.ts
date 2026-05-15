import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IPost } from '../../types';

interface PostState {
  posts: IPost[];
  feedPosts: IPost[];
  currentPost: IPost | null;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
}

const initialState: PostState = {
  posts: [],
  feedPosts: [],
  currentPost: null,
  isLoading: false,
  error: null,
  hasMore: true,
  currentPage: 0,
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setFeedPosts(state, action: PayloadAction<IPost[]>) {
      state.feedPosts = action.payload;
    },
    appendFeedPosts(state, action: PayloadAction<IPost[]>) {
      state.feedPosts = [...state.feedPosts, ...action.payload];
    },
    setCurrentPost(state, action: PayloadAction<IPost | null>) {
      state.currentPost = action.payload;
    },
    addPost(state, action: PayloadAction<IPost>) {
      state.feedPosts = [action.payload, ...state.feedPosts];
    },
    removePost(state, action: PayloadAction<number>) {
      state.feedPosts = state.feedPosts.filter((p) => p.id !== action.payload);
      state.posts = state.posts.filter((p) => p.id !== action.payload);
    },
    updatePostLike(
      state,
      action: PayloadAction<{ postId: number; liked: boolean; count: number }>
    ) {
      const { postId, liked, count } = action.payload;
      const updatePost = (p: IPost) => {
        if (p.id === postId) {
          return { ...p, is_liked_by_me: liked, like_count: count };
        }
        return p;
      };
      state.feedPosts = state.feedPosts.map(updatePost);
      state.posts = state.posts.map(updatePost);
      if (state.currentPost?.id === postId) {
        state.currentPost = updatePost(state.currentPost);
      }
    },
    updateCommentCount(
      state,
      action: PayloadAction<{ postId: number; count: number }>
    ) {
      const { postId, count } = action.payload;
      const update = (p: IPost) =>
        p.id === postId ? { ...p, comment_count: count } : p;
      state.feedPosts = state.feedPosts.map(update);
      state.posts = state.posts.map(update);
    },
    setHasMore(state, action: PayloadAction<boolean>) {
      state.hasMore = action.payload;
    },
    incrementPage(state) {
      state.currentPage += 1;
    },
    resetFeed(state) {
      state.feedPosts = [];
      state.currentPage = 0;
      state.hasMore = true;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  setFeedPosts,
  appendFeedPosts,
  setCurrentPost,
  addPost,
  removePost,
  updatePostLike,
  updateCommentCount,
  setHasMore,
  incrementPage,
  resetFeed,
  setError,
} = postSlice.actions;

export default postSlice.reducer;
