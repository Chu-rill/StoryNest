import React, { useState } from "react";
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
} from "lucide-react";

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

  const isOwnProfile = user?.id === userData.id;

  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to follow users");
      return;
    }

    if (isLoading) return; // Prevent double-clicks

    setIsLoading(true);
    try {
      const updatedUser = userData.isFollowing
        ? await unfollowUser(userData.id)
        : await followUser(userData.id);

      if (onUpdateUser) {
        onUpdateUser(updatedUser);
      }

      toast.success(
        userData.isFollowing
          ? `Unfollowed ${userData.username}`
          : `Now following ${userData.username}`
      );
    } catch (error) {
      console.error("Follow/unfollow error:", error);
      toast.error("Failed to update follow status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Hide the image and show the gradient background instead
    e.currentTarget.style.display = "none";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Cover Image */}
      <div className="relative h-32 md:h-48">
        {userData.profileBackground ? (
          <>
            <img
              src={userData.profileBackground}
              alt={`${userData.username}'s cover`}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
            {/* Fallback gradient - will show if image fails to load */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 -z-10"></div>
          </>
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
                src={userData.profilePicture}
                fallback={userData.username}
                size="xl"
                className="ring-4 ring-white dark:ring-gray-800"
              />
            </div>

            <div className="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {userData.username}
              </h1>
              {userData.username && userData.username !== userData.username && (
                <p className="text-gray-600 dark:text-gray-400">
                  {userData.username}
                </p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center sm:justify-start mt-1">
                <Calendar size={14} className="mr-1" />
                Joined{" "}
                {formatDistanceToNow(new Date(userData.createdAt), {
                  addSuffix: true,
                })}
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
                onClick={handleFollowToggle}
                variant={userData.isFollowing ? "outline" : "primary"}
                disabled={isLoading}
                icon={
                  userData.isFollowing ? (
                    <UserMinus size={16} />
                  ) : (
                    <UserPlus size={16} />
                  )
                }
              >
                {isLoading
                  ? "..."
                  : userData.isFollowing
                  ? "Unfollow"
                  : "Follow"}
              </Button>
            )}
          </div>
        </div>

        {userData.bio && (
          <div className="mt-5 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {userData.bio}
          </div>
        )}

        {/* Additional profile info */}
        {/* {(userData.location || userData.website) && (
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            {userData.location && (
              <div className="flex items-center">
                <MapPin size={14} className="mr-1" />
                {userData.location}
              </div>
            )}
            {userData.website && (
              <div className="flex items-center">
                <LinkIcon size={14} className="mr-1" />
                <a
                  href={userData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {userData.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}
          </div>
        )} */}

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-200 dark:border-gray-700 pt-5">
          <div className="text-center">
            <span className="block text-2xl font-bold text-gray-900 dark:text-white">
              {userData.followersCount?.toLocaleString() || 0}
            </span>
            <span className="block text-sm text-gray-500 dark:text-gray-400">
              Followers
            </span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-gray-900 dark:text-white">
              {userData.followingCount?.toLocaleString() || 0}
            </span>
            <span className="block text-sm text-gray-500 dark:text-gray-400">
              Following
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
