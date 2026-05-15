import React, { useEffect, useState } from 'react';
import { postService } from '../../services/postService';
import type { ILike } from '../../types';
import { getAvatarUrl } from '../../utils/helpers';

interface Props {
  postId: number;
  onClose: () => void;
}

const LikedUsersModal: React.FC<Props> = ({ postId, onClose }) => {
  const [likes, setLikes] = useState<ILike[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    postService.getLikedUsers(postId).then((data) => {
      setLikes(data);
      setLoading(false);
    });
  }, [postId]);

  return (
    <div className="ic-modal-overlay" onClick={onClose}>
      <div className="ic-modal" style={{ width: 340 }} onClick={(e) => e.stopPropagation()}>
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom border-ic">
          <h6 className="mb-0 fw-bold">Likes</h6>
          <button className="btn-outline-ic" style={{ border: 'none', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
            <i className="bi bi-x" />
          </button>
        </div>
        <div style={{ maxHeight: 360, overflowY: 'auto' }}>
          {loading ? (
            <div className="ic-spinner"><div className="spinner-border" /></div>
          ) : likes.length === 0 ? (
            <div className="empty-state py-4">
              <i className="bi bi-heart" />
              <p style={{ fontSize: '0.88rem' }}>No likes yet</p>
            </div>
          ) : (
            likes.map((l) => (
              <div key={l.user_id} className="d-flex align-items-center gap-3 px-3 py-2">
                {l.user && (
                  <img src={getAvatarUrl(l.user)} alt={l.user.username} className="ic-avatar ic-avatar-md" />
                )}
                <div>
                  <p className="fw-600 mb-0" style={{ fontSize: '0.9rem' }}>{l.user?.username}</p>
                  <small className="text-ic-muted">{l.user?.full_name}</small>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LikedUsersModal;
