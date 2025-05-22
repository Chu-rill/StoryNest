import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserById, getUserProfile } from "../../services/authService";
import { getUserPosts } from "../../services/postService";
import { User, Post, UserResponse } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import UserProfile from "../../components/user/UserProfile";
import PostCard from "../../components/post/PostCard";
import Card, { CardBody } from "../../components/ui/Card";
// import { Tabs, Hash } from "lucide-react";
import Button from "../../components/ui/Button";
// import toast from "react-hot-toast";

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const { user: currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<"posts" | "about">("posts");

  useEffect(() => {
    fetchUserData();
  }, [userId, currentUser]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      let userInfo: UserResponse;

      // If userId is provided, fetch that user's data
      // Otherwise, show the current logged-in user's profile
      if (userId) {
        userInfo = await getUserById(userId);
      } else {
        if (!currentUser) {
          throw new Error("User not authenticated");
        }
        userInfo = await getUserProfile();
      }

      setUserData(userInfo.profile);

      // Fetch user's posts - handle "no posts" separately from other errors
      try {
        const userPosts = await getUserPosts(userInfo.profile.id);
        setPosts(Array.isArray(userPosts.posts) ? userPosts.posts : []);
      } catch (postError: any) {
        // Check if it's a "no posts found" error
        if (
          postError?.response?.status === 400 &&
          postError?.response?.data?.message?.includes("No posts found")
        ) {
          // console.log("No posts found for user, setting empty array");
          setPosts([]);
        } else {
          // For other post-related errors, log but don't break the profile display
          console.error("Failed to fetch user posts:", postError);
          setPosts([]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setError("Failed to load user profile. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUserData(updatedUser);
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(
      posts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-md">
          {error || "User not found"}
          <div className="mt-4">
            <Link
              to="/"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser && currentUser.id === userData.id;

  return (
    <div className="max-w-4xl mx-auto py-6">
      {/* User profile header */}
      <Link to="/">
        <Button className=" mb-5">Dashboard</Button>
      </Link>
      <UserProfile userData={userData} onUpdateUser={handleUserUpdate} />

      {/* Profile tabs */}
      <div className="mt-8 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab("posts")}
            className={`py-4 font-medium text-sm border-b-2 ${
              activeTab === "posts"
                ? "border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`py-4 font-medium text-sm border-b-2 ${
              activeTab === "about"
                ? "border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            About
          </button>
        </div>
      </div>

      <div className="mt-6">
        {activeTab === "posts" && (
          <div>
            {isOwnProfile && (
              <div className="mb-6">
                <Link to="/create-post">
                  <Button>Create New Post</Button>
                </Link>
              </div>
            )}

            {posts.length === 0 ? (
              <Card>
                <CardBody className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {isOwnProfile
                      ? "You haven't created any posts yet."
                      : `${userData.username} hasn't created any posts yet.`}
                  </p>
                  {isOwnProfile && (
                    <Link to="/create-post">
                      <Button>Write Your First Post</Button>
                    </Link>
                  )}
                </CardBody>
              </Card>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onPostUpdate={handlePostUpdate}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "about" && (
          <Card>
            <CardBody>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                About
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Bio
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {userData.bio || (
                      <span className="text-gray-500 italic">
                        {isOwnProfile
                          ? "You have not added a bio yet."
                          : `${userData.username} has not added a bio yet.`}
                      </span>
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Member since
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {new Date(userData.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {isOwnProfile && (
                <div className="mt-6">
                  <Link to="/profile/edit">
                    <Button variant="outline">Edit Profile</Button>
                  </Link>
                </div>
              )}
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
