import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types';
import Button from '../ui/Button';

interface FollowButtonProps {
  targetUser: User;
  onUserUpdated?: (user: User) => void;
}

const FollowButton = ({ targetUser, onUserUpdated }: FollowButtonProps) => {
  const { user, followUser, unfollowUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  if (!user || user._id === targetUser._id) {
    return null;
  }

  const isFollowing = user.following.includes(targetUser._id);

  const handleFollowAction = async () => {
    if (!user) {
      toast.info('Please log in to follow users');
      return;
    }

    setIsLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(targetUser._id);
      } else {
        await followUser(targetUser._id);
      }
      if (onUserUpdated) onUserUpdated(targetUser);
    } catch (error) {
      // Error handling is done in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleFollowAction}
      variant={isFollowing ? 'outline' : 'primary'}
      isLoading={isLoading}
      className="ml-2"
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  );
};

export default FollowButton;