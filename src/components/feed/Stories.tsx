import React from 'react';
import { MOCK_USERS } from '../../mock/mockData';
import { getAvatarUrl } from '../../utils/helpers';
import { useAppSelector } from '../../store';

const Stories: React.FC = () => {
  const { user } = useAppSelector((s) => s.auth);

  return (
    <div className="ic-card p-3 mb-4" style={{ maxWidth: 470, margin: '0 auto 1.25rem' }}>
      <div className="stories-row">
        {/* Your Story */}
        {user && (
          <div className="story-item">
            <div className="position-relative">
              <div className="ic-avatar-story" style={{ padding: 2 }}>
                <img src={getAvatarUrl(user)} alt="Your Story" className="ic-avatar ic-avatar-lg" style={{ border: '2px solid var(--bg-primary)' }} />
              </div>
              <div
                className="position-absolute"
                style={{
                  bottom: 0, right: 0,
                  width: 22, height: 22,
                  background: '#0095f6',
                  borderRadius: '50%',
                  border: '2px solid var(--bg-card)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', color: 'white', fontWeight: 700,
                }}
              >
                +
              </div>
            </div>
            <span>Your Story</span>
          </div>
        )}

        {/* Other Users */}
        {MOCK_USERS.filter((u) => u.id !== user?.id).map((u) => (
          <div key={u.id} className="story-item">
            <div className="ic-avatar-story" style={{ padding: 2 }}>
              <img
                src={getAvatarUrl(u)}
                alt={u.username}
                className="ic-avatar ic-avatar-lg"
                style={{ border: '2px solid var(--bg-card)' }}
              />
            </div>
            <span>{u.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stories;
