// UserCard.tsx
import React from "react";
import { UserMinus, UserPlus } from "lucide-react";
import { User } from "../../types";

interface UserCardProps {
  user: User;
  isFollowing: boolean;
  onFollowToggle: (userId: string) => Promise<void>;
  isLoading: boolean;
  currentUserId: string;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  isFollowing,
  onFollowToggle,
  isLoading,
  currentUserId,
}) => {
  const isOwnProfile = user.id === currentUserId;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={user.profilePicture}
            alt={user.username}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {user.username}
            </h3>
            {user.bio && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {user.bio}
              </p>
            )}
          </div>
        </div>

        {!isOwnProfile && (
          <button
            onClick={() => onFollowToggle(user.id)}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              isFollowing
                ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                : "bg-blue-600 text-white hover:bg-blue-700"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isFollowing ? <UserMinus size={16} /> : <UserPlus size={16} />}
                <span>{isFollowing ? "Unfollow" : "Follow"}</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default UserCard;
