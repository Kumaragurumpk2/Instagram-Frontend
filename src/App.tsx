import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppSelector } from './store';

// Layouts & Routes
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import TrendingPage from './pages/TrendingPage';
import SearchPage from './pages/SearchPage';
import ExplorePage from './pages/ExplorePage';

const NotFoundPage: React.FC = () => (
  <div className="empty-state" style={{ minHeight: '80vh' }}>
    <i className="bi bi-exclamation-triangle" style={{ fontSize: '4rem', color: 'var(--brand-primary)' }} />
    <h2 className="fw-bold">404</h2>
    <h4>Page not found</h4>
    <p className="text-ic-muted">The page you're looking for doesn't exist.</p>
    <a href="/feed" className="btn-brand px-4 py-2">Go to Feed</a>
  </div>
);

const NotificationsPage: React.FC = () => {
  const { notifications } = useAppSelector((s) => s.ui);
  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h3 className="fw-bold mb-4">Notifications</h3>
      {notifications.length === 0 ? (
        <div className="empty-state"><i className="bi bi-bell-slash" /><h4>No notifications</h4></div>
      ) : notifications.map((n) => (
        <div key={n.id} className={`notif-item ic-card mb-2 ${!n.is_read ? 'unread' : ''}`}>
          <span>
            {n.type === 'LIKE' && <i className="bi bi-heart-fill text-danger fs-5" />}
            {n.type === 'COMMENT' && <i className="bi bi-chat-fill fs-5" style={{ color: '#0095f6' }} />}
            {n.type === 'FOLLOW' && <i className="bi bi-person-plus-fill fs-5" style={{ color: 'var(--online-color)' }} />}
          </span>
          <div className="flex-1">
            <p className="mb-0" style={{ fontSize: '0.9rem' }}>{n.message}</p>
          </div>
          {!n.is_read && <span className="unread-dot" />}
        </div>
      ))}
    </div>
  );
};

const App: React.FC = () => {
  const { theme } = useAppSelector((s) => s.ui);

  return (
    <div data-theme={theme}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/feed" element={<FeedPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/trending" element={<TrendingPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/profile/:userId" element={<ProfilePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Route>
          </Route>

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/feed" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>

      {/* Global Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
      />
    </div>
  );
};

export default App;
