import React, { useState } from "react";
import { Users, ArrowLeft, Search } from "lucide-react";
import UserCard from "./UserCard";

interface FollowingPageProps {
  following: any[];
  currentUser: any;
  onBack: () => void;
  onFollowToggle: (userId: string) => Promise<void>;
}

const FollowingPage: React.FC<FollowingPageProps> = ({
  following,
  currentUser,
  onBack,
  onFollowToggle,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );

  const filteredFollowing = following.filter(
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
  console.log("current user:", currentUser);

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
                Following
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {following.length} following
              </p>
            </div>
          </div>
          <Users className="text-gray-400 dark:text-gray-500" size={24} />
        </div>

        {/* Search */}
        {/* <div className="relative mb-6">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
            size={20}
          />
          <input
            type="text"
            placeholder="Search following..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div> */}

        {/* Following List */}
        <div className="space-y-3">
          {filteredFollowing.length > 0 ? (
            filteredFollowing.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                isFollowing={true}
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
                {searchTerm ? "No users found" : "Not following anyone yet"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Start following people to see them here"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowingPage;
