import React, { useState, useEffect } from "react";
import { Users, Search, Filter, UserCheck, TrendingUp } from "lucide-react";
import { getAllUsers } from "../../services/authService";
import { AllUsersResponse, User, UserMod } from "../../types/index";
import { useAuth } from "../../contexts/AuthContext";
import { followUser, unfollowUser } from "../../services/authService";

const getUserFollowing = async () => {
  // Replace with actual API call
  return [];
};

// Mock current user for demo
const mockCurrentUser = {
  id: "current-user",
  username: "currentuser",
  email: "current@example.com",
};

const UsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserMod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "popular">("newest");
  const [showFollowingOnly, setShowFollowingOnly] = useState(false);
  const [followingList, setFollowingList] = useState<string[]>([]);
  const [followingLoading, setFollowingLoading] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    fetchUsers();
    if (currentUser) {
      fetchFollowing();
    }
  }, [currentPage, sortBy, searchQuery, showFollowingOnly, currentUser]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response: AllUsersResponse = await getAllUsers();

      if (response.status === "success" && response.users) {
        let filteredUsers = response.users;

        // Apply search filter
        if (searchQuery.trim()) {
          filteredUsers = filteredUsers.filter(
            (user) =>
              user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (user.bio &&
                user.bio.toLowerCase().includes(searchQuery.toLowerCase()))
          );
        }

        // Apply following filter
        if (showFollowingOnly) {
          filteredUsers = filteredUsers.filter((user) =>
            followingList.includes(user._id || user._id)
          );
        }

        // Apply sorting
        if (sortBy === "newest") {
          filteredUsers.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        } else if (sortBy === "popular") {
          filteredUsers.sort(
            (a, b) => (b.followers?.length || 0) - (a.followers?.length || 0)
          );
        }

        setUsers(filteredUsers);

        // Calculate pagination (assuming 9 users per page)
        const usersPerPage = 9;
        setTotalPages(Math.ceil(filteredUsers.length / usersPerPage));

        // Paginate results
        const startIndex = (currentPage - 1) * usersPerPage;
        const paginatedUsers = filteredUsers.slice(
          startIndex,
          startIndex + usersPerPage
        );
        setUsers(paginatedUsers);
      } else {
        setError("Failed to load users. Please try again later.");
      }
    } catch (error: any) {
      console.error("Failed to fetch users:", error);
      setError(
        error.response?.data?.message ||
          "Failed to load users. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFollowing = async () => {
    try {
      const following = await getUserFollowing();
      setFollowingList(following.map((user: any) => user.id || user.id));
    } catch (error) {
      console.error("Failed to fetch following list:", error);
    }
  };

  const handleFollowToggle = async (userId: string) => {
    if (!currentUser) return;

    setFollowingLoading((prev) => ({ ...prev, [userId]: true }));

    try {
      const isCurrentlyFollowing = followingList.includes(userId);

      if (isCurrentlyFollowing) {
        await unfollowUser(userId);
        setFollowingList((prev) => prev.filter((id) => id !== userId));
      } else {
        await followUser(userId);
        setFollowingList((prev) => [...prev, userId]);
      }
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    } finally {
      setFollowingLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleSearchSubmit = (e?: any) => {
    if (e) e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  const handleSortChange = (newSortBy: "newest" | "popular") => {
    if (sortBy !== newSortBy) {
      setSortBy(newSortBy);
      setCurrentPage(1);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
              <Users className="mr-3" size={32} />
              Discover People
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Connect with amazing creators, developers, and writers in our
              community.
            </p>
          </div>
          <a
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
          >
            Back to Feed
          </a>
        </div>

        {/* Search and filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="mb-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by username or bio..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearchSubmit(e)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <button
                onClick={handleSearchSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Sort options */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sort by:
              </span>
              <button
                onClick={() => handleSortChange("newest")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  sortBy === "newest"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Newest
              </button>
              <button
                onClick={() => handleSortChange("popular")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center space-x-1 ${
                  sortBy === "popular"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <TrendingUp size={14} />
                <span>Popular</span>
              </button>
            </div>

            {/* Following filter */}
            {currentUser && (
              <button
                onClick={() => {
                  setShowFollowingOnly(!showFollowingOnly);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center space-x-1 ${
                  showFollowingOnly
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <UserCheck size={14} />
                <span>Following Only</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Users Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
          {error}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
            No users found
          </p>
          <p className="text-gray-400 dark:text-gray-500">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user._id || user._id}
                className="transform hover:scale-105 transition-transform duration-200"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <a href={`/user/${user._id || user._id}`}>
                        <img
                          src={
                            user.profilePicture ||
                            `https://ui-avatars.com/api/?name=${user.username}&size=48`
                          }
                          alt={user.username}
                          className="w-12 h-12 rounded-full object-cover hover:opacity-80 transition-opacity"
                        />
                      </a>
                      <div className="flex-1">
                        <a
                          href={`/user/${user._id || user._id}`}
                          className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {user.username}
                        </a>
                        {user.bio && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {user.bio}
                          </p>
                        )}
                      </div>
                    </div>

                    {currentUser &&
                      (user._id || user._id) !== currentUser.id && (
                        <button
                          onClick={() =>
                            handleFollowToggle(user._id || user._id)
                          }
                          disabled={
                            followingLoading[user._id || user._id] || false
                          }
                          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                            followingList.includes(user._id || user._id)
                              ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          } ${
                            followingLoading[user._id || user._id]
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {followingLoading[user._id || user._id] ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              {followingList.includes(user._id || user._id) ? (
                                <>
                                  <UserCheck size={16} />
                                  <span>Following</span>
                                </>
                              ) : (
                                <>
                                  <Users size={16} />
                                  <span>Follow</span>
                                </>
                              )}
                            </>
                          )}
                        </button>
                      )}
                  </div>
                </div>

                {/* Additional stats */}
                <div className="mt-2 flex justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>{user.followers?.length || 0} followers</span>
                  <span>•</span>
                  <span>{user.following?.length || 0} following</span>
                  <span>•</span>
                  <span>
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UsersPage;
