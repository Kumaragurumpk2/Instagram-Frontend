import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { toggleTheme, setCreatePostOpen } from '../../store/slices/uiSlice';
import { authService } from '../../services/authService';
import { getAvatarUrl } from '../../utils/helpers';
import NotificationBell from '../notification/NotificationBell';
import { APP_NAME } from '../../constants/apiEndpoints';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);
  const { theme } = useAppSelector((s) => s.ui);

  const handleLogout = (): void => {
    authService.logout();
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="ic-navbar justify-content-between px-3 px-md-4">
      {/* Brand */}
      <NavLink to="/feed" className="brand-text fw-bold fs-4 text-decoration-none">
        <i className="bi bi-camera me-1" />
        {APP_NAME}
      </NavLink>

      {/* Center Search (desktop) */}
      <div className="d-none d-md-block" style={{ width: 240 }}>
        <div className="search-bar-wrap">
          <i className="bi bi-search" />
          <input
            className="ic-input"
            placeholder="Search"
            style={{ borderRadius: 22 }}
            onFocus={() => navigate('/search')}
            readOnly
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="d-flex align-items-center gap-2">
        {/* Create Post */}
        <button
          className="btn-outline-ic d-flex align-items-center gap-1"
          style={{ borderRadius: 22, padding: '0.35rem 0.9rem' }}
          onClick={() => dispatch(setCreatePostOpen(true))}
          title="Create Post"
        >
          <i className="bi bi-plus-lg" />
          <span className="d-none d-sm-inline" style={{ fontSize: '0.88rem' }}>Create</span>
        </button>

        {/* Theme Toggle */}
        <button
          className="btn-outline-ic"
          style={{ borderRadius: 50, width: 36, height: 36, display:'flex', alignItems:'center', justifyContent:'center' }}
          onClick={() => dispatch(toggleTheme())}
          title="Toggle Theme"
        >
          <i className={`bi ${theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-fill'}`} />
        </button>

        {/* Notifications */}
        <NotificationBell />

        {/* Avatar Dropdown */}
        <div className="dropdown">
          <button
            className="btn-outline-ic d-flex align-items-center gap-2 p-1"
            style={{ borderRadius: 22 }}
            data-bs-toggle="dropdown"
          >
            <img
              src={user ? getAvatarUrl(user) : ''}
              alt={user?.username}
              className="ic-avatar ic-avatar-sm"
            />
          </button>
          <ul className="dropdown-menu dropdown-menu-end shadow-lg mt-1">
            <li>
              <NavLink className="dropdown-item" to={`/profile/${user?.id}`}>
                <i className="bi bi-person me-2" />
                Profile
              </NavLink>
            </li>
            <li>
              <NavLink className="dropdown-item" to="/search">
                <i className="bi bi-search me-2" />
                Search
              </NavLink>
            </li>
            <li><hr className="dropdown-divider border-ic" /></li>
            <li>
              <button className="dropdown-item text-danger" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
