import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { postService } from '../services/postService';
import { followService } from '../services/followService';
import { useAppSelector } from '../store';
import type { IUser, IPost, IUserFollowStats, IFollower } from '../types';
import { formatCount, getAvatarUrl, formatFullDate } from '../utils/helpers';
import FollowButton from '../components/follow/FollowButton';

type Tab = 'posts' | 'followers' | 'following';

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAppSelector((s) => s.auth);
  const uid = Number(userId);

  const [profile, setProfile] = useState<IUser | null>(null);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [stats, setStats] = useState<IUserFollowStats | null>(null);
  const [followers, setFollowers] = useState<IFollower[]>([]);
  const [following, setFollowing] = useState<IFollower[]>([]);
  const [tab, setTab] = useState<Tab>('posts');
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);

  useEffect(() => {
    if (!uid) return;
    setLoading(true);
    Promise.all([
      authService.getUserProfile(uid),
      postService.getUserPosts(uid),
      followService.getFollowStats(uid),
      followService.getFollowers(uid),
      followService.getFollowing(uid),
    ]).then(([prof, p, s, f, fn]) => {
      setProfile(prof);
      setPosts(p);
      setStats(s);
      setFollowers(f);
      setFollowing(fn);
      setLoading(false);
    });
  }, [uid]);

  if (loading) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="d-flex gap-4 mb-4">
          <div className="skeleton" style={{ width: 128, height: 128, borderRadius: '50%' }} />
          <div className="flex-1 pt-2">
            <div className="skeleton mb-2" style={{ width: 200, height: 20, borderRadius: 4 }} />
            <div className="skeleton mb-3" style={{ width: 280, height: 14, borderRadius: 4 }} />
            <div className="d-flex gap-4">
              {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ width: 60, height: 14, borderRadius: 4 }} />)}
            </div>
          </div>
        </div>
        <div className="profile-posts-grid">
          {[1,2,3,4,5,6].map((i) => <div key={i} className="skeleton" style={{ aspectRatio: '1', borderRadius: 4 }} />)}
        </div>
      </div>
    );
  }

  if (!profile) return (
    <div className="empty-state">
      <i className="bi bi-person-x" />
      <h4>User not found</h4>
    </div>
  );

  const isOwn = currentUser?.id === uid;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Profile Header */}
      <div className="d-flex flex-column flex-sm-row gap-4 mb-5">
        {/* Avatar */}
        <div className="flex-shrink-0 text-center">
          <div className="ic-avatar-story d-inline-block" style={{ padding: 3 }}>
            <img
              src={getAvatarUrl(profile)}
              alt={profile.username}
              className="ic-avatar ic-avatar-xxl"
              style={{ border: '3px solid var(--bg-primary)' }}
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
            <h3 className="fw-bold mb-0">{profile.username}</h3>
            {isOwn ? (
              <Link to="/edit-profile" className="btn-outline-ic" style={{ borderRadius: 8, padding: '0.3rem 1rem', textDecoration: 'none', fontSize: '0.88rem' }}>
                Edit Profile
              </Link>
            ) : currentUser && (
              <FollowButton currentUserId={currentUser.id} targetUserId={uid} />
            )}
          </div>

          {/* Stats */}
          <div className="d-flex gap-4 mb-3">
            <div className="text-center cursor-pointer" onClick={() => setTab('posts')}>
              <span className="fw-bold d-block">{formatCount(posts.length)}</span>
              <small className="text-ic-muted">posts</small>
            </div>
            <div className="text-center cursor-pointer" onClick={() => setTab('followers')}>
              <span className="fw-bold d-block">{formatCount(stats?.followers_count ?? 0)}</span>
              <small className="text-ic-muted">followers</small>
            </div>
            <div className="text-center cursor-pointer" onClick={() => setTab('following')}>
              <span className="fw-bold d-block">{formatCount(stats?.following_count ?? 0)}</span>
              <small className="text-ic-muted">following</small>
            </div>
          </div>

          <p className="fw-600 mb-1">{profile.full_name}</p>
          <small className="text-ic-muted">Member since {formatFullDate(profile.created_at)}</small>
        </div>
      </div>

      {/* Tabs */}
      <div className="d-flex border-top border-ic mb-4">
        {(['posts', 'followers', 'following'] as Tab[]).map((t) => (
          <button
            key={t}
            className={`flex-1 py-2 ${tab === t ? 'fw-700' : 'text-ic-muted'}`}
            style={{ border: 'none', background: 'none', borderTop: tab === t ? '2px solid var(--text-primary)' : '2px solid transparent', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', color: tab === t ? 'var(--text-primary)' : undefined }}
            onClick={() => setTab(t)}
          >
            {t === 'posts' && <i className="bi bi-grid me-1" />}
            {t === 'followers' && <i className="bi bi-people me-1" />}
            {t === 'following' && <i className="bi bi-person-plus me-1" />}
            {t}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      {tab === 'posts' && (
        posts.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-camera" />
            <h4>No Posts Yet</h4>
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
              </div>
            ))}
          </div>
        )
      )}

      {/* Followers List */}
      {tab === 'followers' && (
        <div style={{ maxWidth: 400, margin: '0 auto' }}>
          {followers.length === 0 ? (
            <div className="empty-state"><i className="bi bi-people" /><h4>No followers yet</h4></div>
          ) : followers.map((f) => f.user && (
            <div key={f.user_id} className="d-flex align-items-center justify-content-between py-2">
              <div className="d-flex align-items-center gap-3">
                <img src={getAvatarUrl(f.user)} alt={f.user.username} className="ic-avatar ic-avatar-md" />
                <div>
                  <p className="fw-600 mb-0" style={{ fontSize: '0.9rem' }}>{f.user.username}</p>
                  <small className="text-ic-muted">{f.user.full_name}</small>
                </div>
              </div>
              {currentUser && <FollowButton currentUserId={currentUser.id} targetUserId={f.user_id} />}
            </div>
          ))}
        </div>
      )}

      {/* Following List */}
      {tab === 'following' && (
        <div style={{ maxWidth: 400, margin: '0 auto' }}>
          {following.length === 0 ? (
            <div className="empty-state"><i className="bi bi-person-plus" /><h4>Not following anyone yet</h4></div>
          ) : following.map((f) => f.following_user && (
            <div key={f.following_id} className="d-flex align-items-center justify-content-between py-2">
              <div className="d-flex align-items-center gap-3">
                <img src={getAvatarUrl(f.following_user)} alt={f.following_user.username} className="ic-avatar ic-avatar-md" />
                <div>
                  <p className="fw-600 mb-0" style={{ fontSize: '0.9rem' }}>{f.following_user.username}</p>
                  <small className="text-ic-muted">{f.following_user.full_name}</small>
                </div>
              </div>
              {currentUser && <FollowButton currentUserId={currentUser.id} targetUserId={f.following_id} />}
            </div>
          ))}
        </div>
      )}

      {/* Post Quick View Modal */}
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
              <p style={{ fontSize: '0.9rem' }}><span className="fw-600 me-1">{profile.username}</span>{selectedPost.caption}</p>
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

export default ProfilePage;
