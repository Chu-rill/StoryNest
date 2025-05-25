import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User } from "../../types";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import { useAuth } from "../../contexts/AuthContext";
import { followUser, unfollowUser } from "../../services/authService";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import {
  UserPlus,
  UserMinus,
  MapPin,
  Calendar,
  Link as LinkIcon,
  Users,
} from "lucide-react";
import FollowersPage from "./Followers"; // Adjust import path as needed
import FollowingPage from "./Following"; // Adjust import path as needed

interface UserProfileProps {
  userData: User;
  onUpdateUser?: (updatedUser: User) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  userData,
  onUpdateUser,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentUserData, setCurrentUserData] = useState(userData);
  const [currentView, setCurrentView] = useState<
    "profile" | "followers" | "following"
  >("profile");

  // Update local state when userData prop changes
  useEffect(() => {
    setCurrentUserData(userData);
  }, [userData]);

  const isOwnProfile = user?.id === currentUserData.id;

  // Safe check for followers array - provide fallback empty array
  const followers = currentUserData.followers || [];
  const following = currentUserData.following || [];

  // More robust following check
  const isFollowing = React.useMemo(() => {
    if (!user?.id || !isAuthenticated) return false;

    const found = followers.find((follower) => {
      // Handle different possible formats
      if (typeof follower === "string") return follower === user.id;
      if (typeof follower === "object" && follower !== null) {
        return follower.id === user.id || follower._id === user.id;
      }
      return false;
    });

    return !!found;
  }, [user?.id, followers, isAuthenticated]);

  const handleFollowToggle = async (targetUserId?: string) => {
    const userIdToToggle = targetUserId || currentUserData.id;

    if (!isAuthenticated || !user?.id) {
      toast.error("Please log in to follow users");
      return;
    }

    if (user.id === userIdToToggle) {
      toast.error("You cannot follow yourself");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    try {
      let updatedUser;

      // Check if we're following the target user
      const isCurrentlyFollowing = targetUserId
        ? user.following?.some((followedUser: any) => {
            if (typeof followedUser === "string")
              return followedUser === targetUserId;
            if (typeof followedUser === "object" && followedUser !== null) {
              return (
                followedUser.id === targetUserId ||
                followedUser._id === targetUserId
              );
            }
            return false;
          })
        : isFollowing;

      if (isCurrentlyFollowing) {
        updatedUser = await unfollowUser(userIdToToggle);
      } else {
        updatedUser = await followUser(userIdToToggle);
      }

      // If we're updating the main profile user
      if (!targetUserId || targetUserId === currentUserData.id) {
        if (updatedUser && updatedUser.id) {
          setCurrentUserData(updatedUser);
          if (onUpdateUser) {
            onUpdateUser(updatedUser);
          }
        } else {
          // Fallback: manually update the followers array
          const newFollowers = isCurrentlyFollowing
            ? followers.filter((f) => (f.id || f._id || f) !== user.id)
            : [...followers, { id: user.id, username: user.username }];

          const updatedUserData = {
            ...currentUserData,
            followers: newFollowers,
          };

          setCurrentUserData(updatedUserData);
          if (onUpdateUser) {
            onUpdateUser(updatedUserData);
          }
        }
      }

      const username = targetUserId
        ? followers.find((f) => f.id === targetUserId)?.username || "user"
        : currentUserData.username;

      toast.success(
        isCurrentlyFollowing
          ? `Unfollowed ${username}`
          : `Now following ${username}`
      );
    } catch (error) {
      console.error("Follow/unfollow error:", error);
      toast.error("Failed to update follow status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageError = () => {
    console.log(
      "Background image failed to load:",
      currentUserData.profileBackground
    );
    setImageError(true);
  };

  // Function to clean up database values that might have quotes
  const cleanUrl = (url: string) => {
    if (!url) return url;
    // Remove surrounding quotes if they exist
    return url.replace(/^["']|["']$/g, "").trim();
  };

  // Clean the background URL and check if it's valid
  const cleanedBackgroundUrl = cleanUrl(currentUserData.profileBackground);
  const hasValidBackground =
    cleanedBackgroundUrl &&
    cleanedBackgroundUrl !== "" &&
    cleanedBackgroundUrl !== "null" &&
    cleanedBackgroundUrl !== "undefined";

  // Handle back navigation
  const handleBack = () => {
    setCurrentView("profile");
  };

  // Get current user's following list for the followers page
  const getCurrentUserFollowing = () => {
    return user?.following || [];
  };

  // Render based on current view
  if (currentView === "followers") {
    return (
      <FollowersPage
        followers={followers}
        currentUser={user}
        onBack={handleBack}
        followingList={getCurrentUserFollowing()}
        onFollowToggle={handleFollowToggle}
      />
    );
  }

  if (currentView === "following") {
    return (
      <FollowingPage
        following={following}
        currentUser={user}
        onBack={handleBack}
        onFollowToggle={handleFollowToggle}
      />
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Cover Image */}
      <div className="relative h-32 md:h-48">
        {hasValidBackground && !imageError ? (
          <img
            src={cleanedBackgroundUrl}
            alt={`${currentUserData.username}'s cover`}
            className="w-full h-full object-cover"
            onError={handleImageError}
            onLoad={() => console.log("Background image loaded successfully")}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
        )}
      </div>

      <div className="px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex sm:items-center">
            {/* Avatar - positioned to overlap the cover image */}
            <div className="-mt-16 md:-mt-20 border-4 border-white dark:border-gray-800 rounded-full">
              <Avatar
                src={cleanUrl(currentUserData.profilePicture)}
                fallback={currentUserData.username}
                size="xl"
                className="ring-4 ring-white dark:ring-gray-800"
              />
            </div>

            <div className="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {currentUserData.username}
              </h1>
              {currentUserData.username &&
                currentUserData.username !== currentUserData.username && (
                  <p className="text-gray-600 dark:text-gray-400">
                    {currentUserData.username}
                  </p>
                )}
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center sm:justify-start mt-1">
                <Calendar size={14} className="mr-1" />
                Joined{" "}
                {currentUserData.createdAt &&
                !isNaN(new Date(currentUserData.createdAt).getTime())
                  ? formatDistanceToNow(new Date(currentUserData.createdAt), {
                      addSuffix: true,
                    })
                  : "recently"}
              </p>
            </div>
          </div>

          <div className="mt-5 sm:mt-0 flex justify-center">
            {isOwnProfile ? (
              <Link to="/profile/edit">
                <Button variant="outline">Edit Profile</Button>
              </Link>
            ) : (
              <Button
                onClick={() => handleFollowToggle()}
                variant={isFollowing ? "outline" : "primary"}
                disabled={isLoading}
                icon={
                  isFollowing ? <UserMinus size={16} /> : <UserPlus size={16} />
                }
              >
                {isLoading ? "..." : isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}
          </div>
        </div>

        {currentUserData.bio && (
          <div className="mt-5 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {currentUserData.bio}
          </div>
        )}

        {/* Stats - Now Clickable */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-200 dark:border-gray-700 pt-5">
          <button
            onClick={() => setCurrentView("followers")}
            className="text-center hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors group"
          >
            <span className="block text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {followers.length?.toLocaleString() || 0}
            </span>
            <span className="block text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              Followers
            </span>
          </button>
          <button
            onClick={() => setCurrentView("following")}
            className="text-center hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors group"
          >
            <span className="block text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {following.length?.toLocaleString() || 0}
            </span>
            <span className="block text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              Following
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
