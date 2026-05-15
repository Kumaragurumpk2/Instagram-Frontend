import React, { useEffect, useState } from 'react';
import { trendingService } from '../services/trendingService';
import type { ITrendingPost, ITrendingHashtag } from '../types';
import { formatCount } from '../utils/helpers';

const TrendingPage: React.FC = () => {
  const [trendingPosts, setTrendingPosts] = useState<ITrendingPost[]>([]);
  const [trendingHashtags, setTrendingHashtags] = useState<ITrendingHashtag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      trendingService.getTrendingPosts(),
      trendingService.getTrendingHashtags(),
    ]).then(([posts, hashtags]) => {
      setTrendingPosts(posts);
      setTrendingHashtags(hashtags);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      <div className="d-flex align-items-center gap-2 mb-4">
        <i className="bi bi-fire" style={{ fontSize: '1.8rem', color: 'var(--trending-color)' }} />
        <h2 className="fw-bold mb-0">Trending</h2>
      </div>

      {/* Trending Hashtags */}
      <section className="mb-5">
        <h5 className="fw-600 mb-3 text-ic-secondary">
          <i className="bi bi-hash me-1" />Trending Hashtags
        </h5>
        {loading ? (
          <div className="d-flex flex-wrap gap-2">
            {[1,2,3,4,5].map((i) => <div key={i} className="skeleton" style={{ width: 100, height: 36, borderRadius: 18 }} />)}
          </div>
        ) : (
          <div className="d-flex flex-wrap gap-2">
            {trendingHashtags.map((th, idx) => (
              <div
                key={th.hashtag_id}
                className="d-flex align-items-center gap-2 px-3 py-2"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 22, cursor: 'pointer', transition: 'var(--transition)' }}
              >
                <span style={{ color: 'var(--trending-color)', fontWeight: 700, fontSize: '0.8rem' }}>
                  #{idx + 1}
                </span>
                <span className="fw-600" style={{ fontSize: '0.9rem' }}>
                  #{th.hashtag?.tag}
                </span>
                <span className="text-ic-muted" style={{ fontSize: '0.78rem' }}>
                  {th.score.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Trending Posts */}
      <section>
        <h5 className="fw-600 mb-3 text-ic-secondary">
          <i className="bi bi-grid me-1" />Trending Posts
        </h5>
        {loading ? (
          <div className="trending-grid">
            {[1,2,3,4,5].map((i) => <div key={i} className="skeleton" style={{ aspectRatio: '1', borderRadius: 12 }} />)}
          </div>
        ) : (
          <div className="trending-grid">
            {trendingPosts.map((tp) => (
              <div key={tp.post_id} className="trending-card">
                <img
                  src={tp.post?.media?.[0]?.preview_url || ''}
                  alt={`trending-${tp.post_id}`}
                  loading="lazy"
                />
                <span className="score-badge">
                  <i className="bi bi-fire me-1" />{tp.score.toFixed(1)}
                </span>
                <div className="caption-overlay">
                  <p className="mb-1" style={{ fontSize: '0.8rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {tp.post?.caption}
                  </p>
                  <div className="d-flex gap-3">
                    <span style={{ fontSize: '0.75rem' }}>
                      <i className="bi bi-heart-fill me-1" />{formatCount(tp.post?.like_count ?? 0)}
                    </span>
                    <span style={{ fontSize: '0.75rem' }}>
                      <i className="bi bi-chat-fill me-1" />{formatCount(tp.post?.comment_count ?? 0)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default TrendingPage;
