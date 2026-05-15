import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store';
import { setCreatePostOpen } from '../../store/slices/uiSlice';
import { getAvatarUrl } from '../../utils/helpers';

const Sidebar: React.FC = () => {
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();

  const links = [
    { to: '/feed', icon: 'bi-house-fill', label: 'Home' },
    { to: '/search', icon: 'bi-search', label: 'Search' },
    { to: '/explore', icon: 'bi-compass', label: 'Explore' },
    { to: '/trending', icon: 'bi-fire', label: 'Trending' },
    { to: '/notifications', icon: 'bi-bell', label: 'Notifications' },
  ];

  return (
    <aside className="ic-sidebar">
      {/* Nav Links */}
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <i className={`bi ${link.icon}`} />
          <span>{link.label}</span>
        </NavLink>
      ))}

      {/* Create Post */}
      <button
        className="sidebar-link w-100 text-start"
        onClick={() => dispatch(setCreatePostOpen(true))}
      >
        <i className="bi bi-plus-square" />
        <span>Create</span>
      </button>

      {/* Profile */}
      {user && (
        <NavLink
          to={`/profile/${user.id}`}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <img
            src={getAvatarUrl(user)}
            alt={user.username}
            className="ic-avatar"
            style={{ width: 28, height: 28 }}
          />
          <span>Profile</span>
        </NavLink>
      )}

      {/* Suggested Users Card */}
      <div className="mt-auto pt-3" style={{ marginTop: 'auto' }}>
        <p className="text-ic-muted px-2" style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' }}>
          SUGGESTIONS
        </p>
        {[1, 2, 3].map((i) => (
          <div key={i} className="d-flex align-items-center gap-2 px-2 py-1">
            <div className="skeleton ic-avatar ic-avatar-sm" />
            <div className="flex-1">
              <div className="skeleton" style={{ height: 10, width: 90, borderRadius: 4, marginBottom: 4 }} />
              <div className="skeleton" style={{ height: 8, width: 60, borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
