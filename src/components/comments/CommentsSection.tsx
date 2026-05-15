import React, { useState, useEffect } from 'react';
import { postService } from '../../services/postService';
import type { IComment } from '../../types';
import { formatRelativeTime, getAvatarUrl } from '../../utils/helpers';

interface Props {
  postId: number;
  userId: number;
}

const CommentsSection: React.FC<Props> = ({ postId, userId }) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    postService.getComments(postId).then((data) => {
      setComments(data);
      setLoading(false);
    });
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !userId) return;
    setSubmitting(true);
    try {
      const comment = await postService.addComment({
        user_id: userId,
        post_id: postId,
        content: input.trim(),
      });
      setComments((prev) => [...prev, comment]);
      setInput('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-top border-ic px-3 pt-2 pb-1">
      {/* Comments list */}
      {loading ? (
        <div className="ic-spinner"><div className="spinner-border" /></div>
      ) : (
        <div style={{ maxHeight: 200, overflowY: 'auto' }}>
          {comments.length === 0 && (
            <p className="text-ic-muted text-center py-2" style={{ fontSize: '0.85rem' }}>
              No comments yet. Be the first!
            </p>
          )}
          {comments.map((c) => (
            <div key={c.id} className="d-flex align-items-start gap-2 py-1">
              <img
                src={c.user ? getAvatarUrl(c.user) : ''}
                alt={c.user?.username}
                className="ic-avatar ic-avatar-sm"
                style={{ marginTop: 2 }}
              />
              <div>
                <p className="mb-0" style={{ fontSize: '0.88rem' }}>
                  <span className="fw-600 me-1">{c.user?.username}</span>
                  {c.content}
                </p>
                <small className="text-ic-muted">{formatRelativeTime(c.created_at)}</small>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <form className="d-flex align-items-center gap-2 pt-2" onSubmit={handleSubmit}>
        <input
          className="ic-input"
          placeholder="Add a comment..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, fontSize: '0.88rem', borderRadius: 22 }}
          maxLength={1000}
        />
        <button
          type="submit"
          disabled={!input.trim() || submitting}
          style={{ color: '#0095f6', background: 'none', border: 'none', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', whiteSpace: 'nowrap', opacity: input.trim() ? 1 : 0.4 }}
        >
          {submitting ? <span className="spinner-border spinner-border-sm" /> : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default CommentsSection;
