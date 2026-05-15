import React, { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import { markNotificationRead, markAllRead } from '../../store/slices/uiSlice';
import { formatRelativeTime, getAvatarUrl } from '../../utils/helpers';

const NotificationBell: React.FC = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { notifications, unreadCount } = useAppSelector((s) => s.ui);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const notifIcon = (type: string) => {
    switch (type) {
      case 'LIKE': return <i className="bi bi-heart-fill text-danger" />;
      case 'COMMENT': return <i className="bi bi-chat-fill" style={{ color: '#0095f6' }} />;
      case 'FOLLOW': return <i className="bi bi-person-plus-fill" style={{ color: '#22c55e' }} />;
      default: return <i className="bi bi-bell-fill" />;
    }
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        className="btn-outline-ic position-relative"
        style={{ borderRadius: 50, width: 36, height: 36, display:'flex', alignItems:'center', justifyContent:'center' }}
        onClick={() => setOpen((o) => !o)}
      >
        <i className="bi bi-bell" />
        {unreadCount > 0 && (
          <span
            className="position-absolute"
            style={{
              top: 2, right: 2,
              background: 'var(--like-color)',
              color: 'white',
              borderRadius: '50%',
              width: 16, height: 16,
              fontSize: '0.65rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700,
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom border-ic">
            <span className="fw-600">Notifications</span>
            <button
              className="btn-outline-ic"
              style={{ fontSize: '0.78rem', padding: '2px 8px' }}
              onClick={() => dispatch(markAllRead())}
            >
              Mark all read
            </button>
          </div>
          {notifications.length === 0 ? (
            <div className="empty-state py-4">
              <i className="bi bi-bell-slash" />
              <p style={{ fontSize: '0.88rem' }}>No notifications yet</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`notif-item ${!n.is_read ? 'unread' : ''}`}
                onClick={() => dispatch(markNotificationRead(n.id))}
              >
                {n.from_user && (
                  <img
                    src={getAvatarUrl(n.from_user)}
                    alt={n.from_user.username}
                    className="ic-avatar ic-avatar-sm"
                  />
                )}
                <div className="flex-1">
                  <p style={{ fontSize: '0.85rem', marginBottom: 2 }}>
                    <span className="fw-600">{n.from_user?.username}</span>{' '}
                    {n.type === 'LIKE' && 'liked your post'}
                    {n.type === 'COMMENT' && 'commented on your post'}
                    {n.type === 'FOLLOW' && 'started following you'}
                  </p>
                  <small className="text-ic-muted">{formatRelativeTime(n.created_at)}</small>
                </div>
                <span>{notifIcon(n.type)}</span>
                {!n.is_read && <span className="unread-dot" />}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
