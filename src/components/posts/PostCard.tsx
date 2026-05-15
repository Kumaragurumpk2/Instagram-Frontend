import React, { useState } from 'react';
import type { IPost } from '../../types';
import { formatRelativeTime, formatCount, getAvatarUrl } from '../../utils/helpers';
import { usePost } from '../../hooks/usePost';
import { useAppSelector, useAppDispatch } from '../../store';
import { removePost } from '../../store/slices/postSlice';
import { postService } from '../../services/postService';
import CommentsSection from '../comments/CommentsSection';
import LikedUsersModal from '../likes/LikedUsersModal';
import DeleteConfirmModal from './DeleteConfirmModal';

interface Props {
  post: IPost;
}

const MediaCarousel: React.FC<{ media: IPost['media'] }> = ({ media }) => {
  const [idx, setIdx] = useState(0);
  if (!media || media.length === 0) return null;

  const current = media[idx];
  return (
    <div className="post-media-carousel">
      {current.media_type === 'VIDEO' ? (
        <video src={current.preview_url || ''} controls />
      ) : (
        <img
          src={current.preview_url || current.media_blob || ''}
          alt={`media-${idx}`}
          loading="lazy"
        />
      )}

      {media.length > 1 && (
        <>
          {idx > 0 && (
            <button className="carousel-nav-btn prev" onClick={() => setIdx(idx - 1)}>
              <i className="bi bi-chevron-left" />
            </button>
          )}
          {idx < media.length - 1 && (
            <button className="carousel-nav-btn next" onClick={() => setIdx(idx + 1)}>
              <i className="bi bi-chevron-right" />
            </button>
          )}
          <div className="carousel-dots">
            {media.map((_, i) => (
              <span key={i} className={`carousel-dot ${i === idx ? 'active' : ''}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const PostCard: React.FC<Props> = ({ post }) => {
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const { toggleLike, isLiking } = usePost();

  const [showComments, setShowComments] = useState(false);
  const [showLikedUsers, setShowLikedUsers] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saved, setSaved] = useState(false);

  const isOwner = user?.id === post.user_id;
  const isLiked = post.is_liked_by_me ?? false;

  const handleLike = (): void => {
    if (!user) return;
    toggleLike(post, user.id);
  };

  const handleDelete = async (): Promise<void> => {
    await postService.deletePost(post.id);
    dispatch(removePost(post.id));
    setShowDeleteModal(false);
  };

  const privacyIcon = (): string => {
    switch (post.privacy) {
      case 'PRIVATE': return 'bi-lock-fill';
      case 'FRIENDS': return 'bi-people-fill';
      case 'CUSTOM': return 'bi-person-check-fill';
      default: return 'bi-globe';
    }
  };

  return (
    <>
      <article className="post-card">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between px-3 py-2">
          <div className="d-flex align-items-center gap-2">
            <div className="ic-avatar-story">
              <img
                src={post.user ? getAvatarUrl(post.user) : ''}
                alt={post.user?.username}
                className="ic-avatar ic-avatar-md"
              />
            </div>
            <div>
              <p className="fw-600 mb-0" style={{ fontSize: '0.9rem' }}>
                {post.user?.username}
              </p>
              <div className="d-flex align-items-center gap-1">
                <small className="text-ic-muted">{formatRelativeTime(post.created_at)}</small>
                <small className="text-ic-muted">·</small>
                <i className={`bi ${privacyIcon()} text-ic-muted`} style={{ fontSize: '0.7rem' }} />
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            {post.is_trending_candidate && (
              <span className="trending-badge">
                <i className="bi bi-fire" /> Trending
              </span>
            )}
            {isOwner && (
              <div className="dropdown">
                <button className="btn-outline-ic" style={{ border:'none', padding:'4px 8px' }} data-bs-toggle="dropdown">
                  <i className="bi bi-three-dots" />
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button className="dropdown-item text-danger" onClick={() => setShowDeleteModal(true)}>
                      <i className="bi bi-trash me-2" />Delete
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Media */}
        <MediaCarousel media={post.media} />

        {/* Actions */}
        <div className="d-flex align-items-center justify-content-between px-3 py-2">
          <div className="d-flex align-items-center gap-3">
            {/* Like */}
            <button
              className={`like-btn ${isLiked ? 'liked' : ''}`}
              onClick={handleLike}
              disabled={isLiking === post.id}
              style={{ color: isLiked ? 'var(--like-color)' : 'var(--text-primary)' }}
            >
              <i className={isLiked ? 'bi bi-heart-fill' : 'bi bi-heart'} />
            </button>

            {/* Comment */}
            <button
              className="like-btn"
              onClick={() => setShowComments(!showComments)}
              style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}
            >
              <i className="bi bi-chat" />
            </button>

            {/* Share */}
            <button
              className="like-btn"
              style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}
              onClick={() => navigator.clipboard?.writeText(window.location.origin + '/post/' + post.id)}
            >
              <i className="bi bi-send" />
            </button>
          </div>

          {/* Save */}
          <button
            className="like-btn"
            style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}
            onClick={() => setSaved(!saved)}
          >
            <i className={saved ? 'bi bi-bookmark-fill' : 'bi bi-bookmark'} />
          </button>
        </div>

        {/* Likes count */}
        <div className="px-3">
          {post.like_count > 0 && (
            <p
              className="fw-600 mb-1 cursor-pointer"
              style={{ fontSize: '0.9rem' }}
              onClick={() => setShowLikedUsers(true)}
            >
              {formatCount(post.like_count)} {post.like_count === 1 ? 'like' : 'likes'}
            </p>
          )}

          {/* Caption */}
          {post.caption && (
            <p style={{ fontSize: '0.9rem', marginBottom: '0.4rem' }}>
              <span className="fw-600 me-1">{post.user?.username}</span>
              {post.caption}
            </p>
          )}

          {/* Hashtags */}
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="d-flex flex-wrap gap-1 mb-1">
              {post.hashtags.map((h) => (
                <span key={h.id} className="hashtag-pill" style={{ fontSize: '0.8rem' }}>
                  #{h.tag}
                </span>
              ))}
            </div>
          )}

          {/* View comments */}
          {post.comment_count > 0 && (
            <button
              className="text-ic-muted"
              style={{ fontSize: '0.85rem', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              onClick={() => setShowComments(!showComments)}
            >
              View all {formatCount(post.comment_count)} comments
            </button>
          )}
        </div>

        {/* Comments Section */}
        {showComments && (
          <CommentsSection postId={post.id} userId={user?.id ?? 0} />
        )}

        <div style={{ height: 12 }} />
      </article>

      {/* Modals */}
      {showLikedUsers && (
        <LikedUsersModal postId={post.id} onClose={() => setShowLikedUsers(false)} />
      )}
      {showDeleteModal && (
        <DeleteConfirmModal
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
};

export default PostCard;
