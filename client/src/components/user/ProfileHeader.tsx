import { User } from '../../types';
import FollowButton from './FollowButton';

interface ProfileHeaderProps {
  user: User;
  postsCount: number;
  onUserUpdated?: (user: User) => void;
}

const ProfileHeader = ({ user, postsCount, onUserUpdated }: ProfileHeaderProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Cover photo - placeholder gradient */}
      <div className="h-40 bg-gradient-to-r from-primary/80 to-secondary/80"></div>
      
      <div className="relative px-6 pb-6">
        {/* Profile picture */}
        <div className="absolute -top-12 left-6 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
          {user.profilePicture ? (
            <img 
              src={user.profilePicture} 
              alt={user.username} 
              className="w-24 h-24 object-cover"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-500">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        
        {/* User info and stats */}
        <div className="mt-14 flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{user.username}</h1>
            {user.bio && <p className="text-gray-600 mt-1">{user.bio}</p>}
          </div>
          <FollowButton 
            targetUser={user} 
            onUserUpdated={onUserUpdated}
          />
        </div>
        
        {/* Stats */}
        <div className="flex mt-6 space-x-6 border-t border-gray-100 pt-6">
          <div className="text-center">
            <span className="block text-2xl font-bold">{postsCount}</span>
            <span className="text-sm text-gray-500">Posts</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold">{user.followers.length}</span>
            <span className="text-sm text-gray-500">Followers</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold">{user.following.length}</span>
            <span className="text-sm text-gray-500">Following</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;