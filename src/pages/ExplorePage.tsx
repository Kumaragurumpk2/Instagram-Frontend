import React, { useEffect, useState } from 'react';
import { postService } from '../services/postService';
import type { IPost } from '../types';
import { formatCount } from '../utils/helpers';

const ExplorePage: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);

  useEffect(() => {
    postService.getAllPosts().then((res) => {
      setPosts(res.content);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      <h3 className="fw-bold mb-4">
        <i className="bi bi-compass me-2" />Explore
      </h3>

      {loading ? (
        <div className="profile-posts-grid">
          {[1,2,3,4,5,6,7,8,9].map((i) => (
            <div key={i} className="skeleton" style={{ aspectRatio:'1', borderRadius: 4 }} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-image" />
          <h4>No posts to explore</h4>
        </div>
      ) : (
        <div className="profile-posts-grid">
          {posts.map((p) => (
            <div key={p.id} className="profile-post-thumb" onClick={() => setSelectedPost(p)}>
              <img src={p.media?.[0]?.preview_url || ''} alt={String(p.id)} loading="lazy" />
              <div className="overlay">
                <span><i className="bi bi-heart-fill me-1" />{formatCount(p.like_count)}</span>
                <span><i className="bi bi-chat-fill me-1" />{formatCount(p.comment_count)}</span>
              </div>
              {p.is_trending_candidate && (
                <span className="trending-badge" style={{ position: 'absolute', top: 8, left: 8 }}>
                  <i className="bi bi-fire" />
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quick View */}
      {selectedPost && (
        <div className="ic-modal-overlay" onClick={() => setSelectedPost(null)}>
          <div className="ic-modal" style={{ width: 'min(500px, 95vw)' }} onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-end p-2">
              <button className="btn-outline-ic" style={{ border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setSelectedPost(null)}>
                <i className="bi bi-x" />
              </button>
            </div>
            <img src={selectedPost.media?.[0]?.preview_url || ''} alt="" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
            <div className="p-3">
              <p style={{ fontSize: '0.9rem' }}>
                <span className="fw-600 me-1">{selectedPost.user?.username}</span>
                {selectedPost.caption}
              </p>
              <div className="d-flex gap-3">
                <span style={{ fontSize: '0.88rem' }}><i className="bi bi-heart me-1" />{formatCount(selectedPost.like_count)}</span>
                <span style={{ fontSize: '0.88rem' }}><i className="bi bi-chat me-1" />{formatCount(selectedPost.comment_count)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
