import React, { useEffect, useRef, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../store';
import {
  appendFeedPosts,
  setHasMore,
  incrementPage,
  resetFeed,
  setLoading,
} from '../store/slices/postSlice';
import { postService } from '../services/postService';
import PostCard from '../components/posts/PostCard';
import Stories from '../components/feed/Stories';
import { FeedSkeletons } from '../components/common/PostSkeleton';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

const FeedPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { feedPosts, isLoading, hasMore, currentPage } = useAppSelector((s) => s.post);
  const initialized = useRef(false);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    dispatch(setLoading(true));
    try {
      const res = await postService.getFeed(currentPage);
      dispatch(appendFeedPosts(res.content));
      dispatch(setHasMore(!res.is_last));
      dispatch(incrementPage());
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, currentPage, isLoading, hasMore]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      dispatch(resetFeed());
      loadMore();
    }
  }, []); // eslint-disable-line

  const sentinelRef = useInfiniteScroll({ onLoadMore: loadMore, hasMore, isLoading });

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Stories />

      {feedPosts.length === 0 && !isLoading ? (
        <div className="empty-state">
          <i className="bi bi-image" />
          <h4>No posts yet</h4>
          <p style={{ fontSize: '0.9rem' }}>Follow people to see their posts in your feed.</p>
        </div>
      ) : (
        feedPosts.map((post) => <PostCard key={post.id} post={post} />)
      )}

      {isLoading && <FeedSkeletons />}

      {!hasMore && feedPosts.length > 0 && (
        <div className="text-center py-4 text-ic-muted" style={{ fontSize: '0.88rem' }}>
          <i className="bi bi-check-circle me-2" />
          You're all caught up!
        </div>
      )}

      <div ref={sentinelRef} style={{ height: 20 }} />
    </div>
  );
};

export default FeedPage;
