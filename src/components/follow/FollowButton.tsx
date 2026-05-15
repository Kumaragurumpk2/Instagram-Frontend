import React, { useState, useEffect } from 'react';
import { followService } from '../../services/followService';

interface Props {
  currentUserId: number;
  targetUserId: number;
  initialFollowing?: boolean;
  onToggle?: (isFollowing: boolean) => void;
}

const FollowButton: React.FC<Props> = ({
  currentUserId,
  targetUserId,
  initialFollowing = false,
  onToggle,
}) => {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    followService.isFollowing(currentUserId, targetUserId).then(setIsFollowing);
  }, [currentUserId, targetUserId]);

  const handleToggle = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        await followService.unfollow(currentUserId, targetUserId);
        setIsFollowing(false);
        onToggle?.(false);
      } else {
        await followService.follow(currentUserId, targetUserId);
        setIsFollowing(true);
        onToggle?.(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (currentUserId === targetUserId) return null;

  return (
    <button
      className={`btn-follow ${isFollowing ? 'following' : ''}`}
      onClick={handleToggle}
      disabled={loading}
    >
      {loading ? (
        <span className="spinner-border spinner-border-sm" />
      ) : isFollowing ? (
        'Following'
      ) : (
        'Follow'
      )}
    </button>
  );
};

export default FollowButton;
