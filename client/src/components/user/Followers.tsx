import React, { useState } from "react";
import { Users, ArrowLeft, Search } from "lucide-react";
import UserCard from "./UserCard";

interface FollowersPageProps {
  followers: any[];
  currentUser: any;
  onBack: () => void;
  followingList: any[];
  onFollowToggle: (userId: string) => Promise<void>;
}

const FollowersPage: React.FC<FollowersPageProps> = ({
  followers,
  currentUser,
  onBack,
  followingList,
  onFollowToggle,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );

  const createEnhancedUser = (user: any, currentUser: any) => {
    const enhancedUser = {
      // User's own data takes priority
      ...user,

      // Fill in missing fields from currentUser or defaults
      profilePicture:
        user.profilePicture ||
        currentUser?.profilePicture ||
        "/default-avatar.png",
      bio: user.bio || currentUser?.bio || "",

      // Ensure required fields exist
      id: user.id || user._id,
      username: user.username || `User ${user.id || user._id}`,
    };

    return enhancedUser;
  };

  const filteredFollowers = followers
    .map((user) => createEnhancedUser(user, currentUser))
    .filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.bio && user.bio.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const handleFollowToggle = async (userId: string) => {
    setLoadingStates((prev) => ({ ...prev, [userId]: true }));
    try {
      await onFollowToggle(userId);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const isUserFollowing = (userId: string) => {
    return followingList.some((user) => user.id === userId);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-900 dark:text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Followers
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {followers.length} followers
              </p>
            </div>
          </div>
          <Users className="text-gray-400 dark:text-gray-500" size={24} />
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
            size={20}
          />
          <input
            type="text"
            placeholder="Search followers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Followers List */}
        <div className="space-y-3">
          {filteredFollowers.length > 0 ? (
            filteredFollowers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                isFollowing={isUserFollowing(user.id)}
                onFollowToggle={handleFollowToggle}
                isLoading={loadingStates[user.id]}
                currentUserId={currentUser.id}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <Users
                className="mx-auto text-gray-300 dark:text-gray-600 mb-4"
                size={48}
              />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchTerm ? "No followers found" : "No followers yet"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "When people follow you, they'll appear here"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowersPage;
