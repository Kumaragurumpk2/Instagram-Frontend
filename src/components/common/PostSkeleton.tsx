import React from 'react';

const PostSkeleton: React.FC = () => (
  <div className="post-card" style={{ padding: '1rem' }}>
    {/* Header */}
    <div className="d-flex align-items-center gap-3 mb-3">
      <div className="skeleton" style={{ width: 44, height: 44, borderRadius: '50%' }} />
      <div>
        <div className="skeleton mb-1" style={{ width: 120, height: 12, borderRadius: 4 }} />
        <div className="skeleton" style={{ width: 70, height: 10, borderRadius: 4 }} />
      </div>
    </div>
    {/* Image */}
    <div className="skeleton" style={{ width: '100%', aspectRatio: '1', borderRadius: 8, marginBottom: '0.75rem' }} />
    {/* Actions */}
    <div className="d-flex gap-3 mb-2">
      <div className="skeleton" style={{ width: 28, height: 28, borderRadius: '50%' }} />
      <div className="skeleton" style={{ width: 28, height: 28, borderRadius: '50%' }} />
      <div className="skeleton" style={{ width: 28, height: 28, borderRadius: '50%' }} />
    </div>
    <div className="skeleton mb-1" style={{ width: 80, height: 12, borderRadius: 4 }} />
    <div className="skeleton" style={{ width: '60%', height: 10, borderRadius: 4 }} />
  </div>
);

export const FeedSkeletons: React.FC = () => (
  <>
    {[1, 2, 3].map((i) => <PostSkeleton key={i} />)}
  </>
);

export default PostSkeleton;
