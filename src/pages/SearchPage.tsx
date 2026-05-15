import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { postService } from '../services/postService';
import type { IUser, IPost, IHashtag } from '../types';
import { getAvatarUrl, formatCount } from '../utils/helpers';
import FollowButton from '../components/follow/FollowButton';
import { useAppSelector } from '../store';
import { Link } from 'react-router-dom';

type SearchTab = 'users' | 'hashtags' | 'posts';

const SearchPage: React.FC = () => {
  const { user: currentUser } = useAppSelector((s) => s.auth);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<SearchTab>('users');
  const [users, setUsers] = useState<IUser[]>([]);
  const [hashtags, setHashtags] = useState<IHashtag[]>([]);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('recent_searches') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    if (!query.trim()) {
      setUsers([]); setHashtags([]); setPosts([]); return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const [u, h] = await Promise.all([
          authService.searchUsers(query),
          postService.searchHashtags(query),
        ]);
        setUsers(u);
        setHashtags(h);
        // Save to recent
        const updated = [query, ...recent.filter((r) => r !== query)].slice(0, 6);
        setRecent(updated);
        localStorage.setItem('recent_searches', JSON.stringify(updated));
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]); // eslint-disable-line

  const clearRecent = () => { setRecent([]); localStorage.removeItem('recent_searches'); };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      {/* Search Input */}
      <div className="search-bar-wrap mb-4">
        <i className="bi bi-search" />
        <input
          className="ic-input"
          placeholder="Search users, hashtags, posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ borderRadius: 22, fontSize: '0.95rem', paddingLeft: '2rem' }}
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <i className="bi bi-x-circle-fill" />
          </button>
        )}
      </div>

      {/* Recent Searches */}
      {!query && recent.length > 0 && (
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <h6 className="fw-600 mb-0">Recent</h6>
            <button onClick={clearRecent} style={{ background: 'none', border: 'none', color: '#0095f6', fontSize: '0.85rem', cursor: 'pointer' }}>Clear all</button>
          </div>
          <div className="d-flex flex-wrap gap-2">
            {recent.map((r) => (
              <span
                key={r}
                className="d-flex align-items-center gap-1"
                style={{ background: 'var(--bg-input)', borderRadius: 22, padding: '4px 12px', fontSize: '0.85rem', cursor: 'pointer' }}
                onClick={() => setQuery(r)}
              >
                <i className="bi bi-clock-history text-ic-muted" style={{ fontSize: '0.75rem' }} />
                {r}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      {query && (
        <>
          <div className="d-flex gap-2 mb-4">
            {(['users', 'hashtags', 'posts'] as SearchTab[]).map((t) => (
              <button
                key={t}
                className={tab === t ? 'btn-brand' : 'btn-outline-ic'}
                style={{ borderRadius: 22, padding: '0.35rem 1rem', fontSize: '0.88rem', textTransform: 'capitalize' }}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="ic-spinner"><div className="spinner-border" /></div>
          ) : (
            <>
              {/* Users */}
              {tab === 'users' && (
                users.length === 0 ? (
                  <div className="empty-state"><i className="bi bi-person-search" /><h4>No users found</h4></div>
                ) : users.map((u) => (
                  <div key={u.id} className="d-flex align-items-center justify-content-between mb-3">
                    <Link to={`/profile/${u.id}`} className="d-flex align-items-center gap-3 text-decoration-none">
                      <img src={getAvatarUrl(u)} alt={u.username} className="ic-avatar ic-avatar-md" />
                      <div>
                        <p className="fw-600 mb-0 text-primary" style={{ color: 'var(--text-primary) !important', fontSize: '0.9rem' }}>{u.username}</p>
                        <small className="text-ic-muted">{u.full_name}</small>
                      </div>
                    </Link>
                    {currentUser && <FollowButton currentUserId={currentUser.id} targetUserId={u.id} />}
                  </div>
                ))
              )}

              {/* Hashtags */}
              {tab === 'hashtags' && (
                hashtags.length === 0 ? (
                  <div className="empty-state"><i className="bi bi-hash" /><h4>No hashtags found</h4></div>
                ) : (
                  <div className="d-flex flex-wrap gap-2">
                    {hashtags.map((h) => (
                      <div
                        key={h.id}
                        className="d-flex align-items-center gap-2 px-3 py-2"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 22, cursor: 'pointer' }}
                      >
                        <span className="fw-600">#{h.tag}</span>
                        <small className="text-ic-muted">{formatCount(h.usage_count)} posts</small>
                      </div>
                    ))}
                  </div>
                )
              )}

              {/* Posts */}
              {tab === 'posts' && (
                <div className="empty-state"><i className="bi bi-search" /><p>Post search coming soon</p></div>
              )}
            </>
          )}
        </>
      )}

      {/* Explore when no query */}
      {!query && (
        <div>
          <h6 className="fw-600 mb-3">Suggested for you</h6>
          {[1,2,3].map((i) => (
            <div key={i} className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-3">
                <div className="skeleton" style={{ width: 44, height: 44, borderRadius: '50%' }} />
                <div>
                  <div className="skeleton mb-1" style={{ width: 110, height: 12, borderRadius: 4 }} />
                  <div className="skeleton" style={{ width: 70, height: 10, borderRadius: 4 }} />
                </div>
              </div>
              <div className="skeleton" style={{ width: 70, height: 30, borderRadius: 8 }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
