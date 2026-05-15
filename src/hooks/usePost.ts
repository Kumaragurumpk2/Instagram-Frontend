import { useState, useCallback } from 'react';
import { postService } from '../services/postService';
import { useAppDispatch } from '../store';
import { updatePostLike } from '../store/slices/postSlice';
import type { IPost } from '../types';

export const usePost = () => {
  const dispatch = useAppDispatch();
  const [isLiking, setIsLiking] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  // Optimistic like toggle
  const toggleLike = useCallback(
    async (post: IPost, userId: number): Promise<void> => {
      if (isLiking === post.id) return;
      setIsLiking(post.id);
      const wasLiked = post.is_liked_by_me ?? false;
      const newCount = wasLiked ? post.like_count - 1 : post.like_count + 1;

      // Optimistic update
      dispatch(updatePostLike({ postId: post.id, liked: !wasLiked, count: newCount }));

      try {
        await postService.toggleLike(post.id, userId, wasLiked);
      } catch {
        // Revert on failure
        dispatch(updatePostLike({ postId: post.id, liked: wasLiked, count: post.like_count }));
      } finally {
        setIsLiking(null);
      }
    },
    [dispatch, isLiking]
  );

  const deletePost = useCallback(
    async (postId: number, onSuccess?: () => void): Promise<void> => {
      setIsDeleting(postId);
      try {
        await postService.deletePost(postId);
        onSuccess?.();
      } finally {
        setIsDeleting(null);
      }
    },
    []
  );

  return { toggleLike, deletePost, isLiking, isDeleting };
};
