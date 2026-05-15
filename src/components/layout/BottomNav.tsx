import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store';
import { setCreatePostOpen } from '../../store/slices/uiSlice';

const BottomNav: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { unreadCount } = useAppSelector((s) => s.ui);

  return (
    <nav className="ic-bottom-nav">
      <NavLink to="/feed" className={({ isActive }) => isActive ? 'active' : ''}>
        <i className="bi bi-house-fill" />
        <span>Home</span>
      </NavLink>
      <NavLink to="/search" className={({ isActive }) => isActive ? 'active' : ''}>
        <i className="bi bi-search" />
        <span>Search</span>
      </NavLink>
      <button
        style={{ background:'none', border:'none', color:'var(--text-secondary)', display:'flex', flexDirection:'column', alignItems:'center', gap:2, cursor:'pointer' }}
        onClick={() => dispatch(setCreatePostOpen(true))}
      >
        <i className="bi bi-plus-square" style={{ fontSize: '1.4rem' }} />
        <span style={{ fontSize: '0.65rem' }}>Create</span>
      </button>
      <NavLink to="/trending" className={({ isActive }) => isActive ? 'active' : ''}>
        <i className="bi bi-fire" />
        <span>Trending</span>
      </NavLink>
      <NavLink
        to={`/profile/${user?.id}`}
        className={({ isActive }) => isActive ? 'active' : ''}
      >
        <div style={{ position:'relative' }}>
          <i className="bi bi-person-circle" />
          {unreadCount > 0 && (
            <span
              className="position-absolute"
              style={{
                top: -4, right: -6,
                background: 'var(--like-color)',
                color: 'white',
                borderRadius: '50%',
                width: 14, height: 14,
                fontSize: '0.55rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700,
              }}
            >
              {unreadCount}
            </span>
          )}
        </div>
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
