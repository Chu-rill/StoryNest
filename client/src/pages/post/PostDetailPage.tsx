import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getPostById,
  likePost,
  unlikePost,
  sharePost,
} from "../../services/postService";
import { Post } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import Avatar from "../../components/ui/Avatar";
import Button from "../../components/ui/Button";
import CommentSection from "../../components/post/CommentSection";
import { formatDistanceToNow, isValid, parseISO } from "date-fns";
import { Heart, Share2, Edit, Trash2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../../components/ui/Modal";

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (postId) {
      fetchPost(postId);
    }
  }, [postId]);

  const fetchPost = async (id: string) => {
    setIsLoading(true);
    try {
      const fetchedPost = await getPostById(id);
      // Ensure the post has the required properties with defaults
      const processedPost = {
        ...fetchedPost.post,
        likes: fetchedPost.post.likes || [],
        tags: fetchedPost.post.tags || [],
        shares: fetchedPost.post.shares || [], // Add shares array
        shareCount: fetchedPost.post.shareCount || 0, // Add share count
      };
      setPost(processedPost);
    } catch (error) {
      console.error("Failed to fetch post:", error);
      setError("Failed to load post. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // More robust isLiked check using useMemo (similar to UserProfile)
  const isLiked = React.useMemo(() => {
    if (!user?.id || !isAuthenticated || !post?.likes) return false;

    const found = post.likes.find((like: any) => {
      // Handle different possible formats
      if (typeof like === "string") return like === user.id;
      if (typeof like === "object" && like !== null) {
        return (
          like.id === user.id || like._id === user.id || like.userId === user.id
        );
      }
      return false;
    });

    return !!found;
  }, [user?.id, post?.likes, isAuthenticated]);

  // Check if user has already shared this post
  const hasShared = React.useMemo(() => {
    if (!user?.id || !isAuthenticated || !post?.shares) return false;

    const found = post.shares.find((share: any) => {
      // Handle different possible formats
      if (typeof share === "string") return share === user.id;
      if (typeof share === "object" && share !== null) {
        return (
          share.id === user.id ||
          share._id === user.id ||
          share.userId === user.id
        );
      }
      return false;
    });

    return !!found;
  }, [user?.id, post?.shares, isAuthenticated]);

  const handleLike = async () => {
    if (!post || !isAuthenticated || !user) {
      toast.error("Please log in to like posts");
      return;
    }

    try {
      let updatedPost;

      if (isLiked) {
        updatedPost = await unlikePost(post.id);
        toast.success("Post unliked");
      } else {
        updatedPost = await likePost(post.id);
        toast.success("Post liked");
      }

      // If API returns updated post data, use it
      if (updatedPost && updatedPost.id) {
        const processedPost = {
          ...updatedPost,
          likes: updatedPost.likes || [],
          tags: updatedPost.tags || [],
          shares: updatedPost.shares || post.shares || [],
          shareCount: updatedPost.shareCount || post.shareCount || 0,
        };
        setPost(processedPost);
      } else {
        // Fallback: manually update the likes array
        const newLikes = isLiked
          ? post.likes.filter((like: any) => {
              if (typeof like === "string") return like !== user.id;
              if (typeof like === "object" && like !== null) {
                return (
                  like.id !== user.id &&
                  like._id !== user.id &&
                  like.userId !== user.id
                );
              }
              return true;
            })
          : [...post.likes, { id: user.id, userId: user.id }];

        const updatedPostData = {
          ...post,
          likes: newLikes,
        };

        setPost(updatedPostData);
      }
    } catch (error) {
      console.error("Failed to update like status:", error);
      toast.error("Failed to update like status");
    }
  };

  const handleShare = async () => {
    if (!post) return;

    setIsSharing(true);

    try {
      // First, record the share in the backend
      if (isAuthenticated && user) {
        try {
          const updatedPost = await sharePost(post.id);

          // Update post state with new share data
          if (updatedPost && updatedPost.post.id) {
            const processedPost = {
              ...updatedPost.post,
              likes: updatedPost.post.likes || post.likes || [],
              tags: updatedPost.post.tags || post.tags || [],
              shares: updatedPost.post.shares || [],
              shareCount: updatedPost.post.shareCount || 0,
            };
            setPost(processedPost);
          } else {
            // Fallback: manually update share count
            const newShares = hasShared
              ? post.shares
              : [
                  ...(post.shares || []),
                  {
                    id: user.id,
                    userId: user.id,
                    sharedAt: new Date().toISOString(),
                  },
                ];

            setPost({
              ...post,
              shares: newShares,
              shareCount: (post.shareCount || 0) + (hasShared ? 0 : 1),
            });
          }
        } catch (apiError) {
          console.error("Failed to record share:", apiError);
          // Continue with share functionality even if API fails
        }
      }

      // Then handle the actual sharing
      if (navigator.share) {
        await navigator.share({
          title: post.title || "Shared post",
          text: post.summary || "",
          url: window.location.href,
        });
        toast.success("Post shared successfully!");
      } else {
        // Fallback for browsers that don't support navigator.share
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (error: unknown) {
      // Handle share cancellation or other errors
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error sharing:", error);
        toast.error("Failed to share post");
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      // API call to delete the post would go here
      // await deletePost(post.id);

      setIsDeleteModalOpen(false);
      toast.success("Post deleted successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  // Helper function to safely format date
  const formatDate = (dateString: string | Date | null | undefined) => {
    if (!dateString) return null;

    try {
      let date: Date;

      if (typeof dateString === "string") {
        // Try parsing as ISO string first
        date = parseISO(dateString);

        // If that fails, try creating a new Date
        if (!isValid(date)) {
          date = new Date(dateString);
        }
      } else {
        date = new Date(dateString);
      }

      // Check if the date is valid
      if (!isValid(date)) {
        console.error("Invalid date:", dateString);
        return null;
      }

      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Error formatting date:", error, dateString);
      return null;
    }
  };

  // Helper function to check if post was edited
  const isPostEdited = () => {
    if (!post?.createdAt || !post?.updatedAt) return false;

    // Parse both dates and compare
    const createdDate = new Date(post.createdAt);
    const updatedDate = new Date(post.updatedAt);

    // Check if both dates are valid
    if (!isValid(createdDate) || !isValid(updatedDate)) return false;

    // Compare timestamps (allow for small differences due to server processing)
    return Math.abs(updatedDate.getTime() - createdDate.getTime()) > 1000; // 1 second threshold
  };

  // Helper function to get likes count safely
  const getLikesCount = (): number => {
    if (!post?.likes) return 0;
    return Array.isArray(post.likes) ? post.likes.length : 0;
  };

  // Helper function to get shares count safely
  const getSharesCount = (): number => {
    // Use shareCount if available, otherwise fall back to shares array length
    if (post?.shareCount !== undefined) return post.shareCount;
    if (!post?.shares) return 0;
    return Array.isArray(post.shares) ? post.shares.length : 0;
  };

  const isAuthor = post && user && post.author && post.author.id === user.id;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-md">
          {error || "Post not found"}
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

  // Format the creation date
  const formattedDate = formatDate(post.createdAt);
  const likesCount = getLikesCount();
  const sharesCount = getSharesCount();

  return (
    <div className="max-w-4xl mx-auto py-6">
      {/* Back to home link */}
      <Link
        to="/"
        className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Feed
      </Link>

      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
        {/* Hero image */}
        {post.image && (
          <div className="w-full h-64 sm:h-80 md:h-96 bg-gray-200 dark:bg-gray-700">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {post.title}
          </h1>

          {/* Meta info */}
          <div className="flex items-center mb-6">
            {post.author && (
              <>
                <Link to={`/user/${post.author.id}`}>
                  <Avatar
                    src={post.author.profilePicture}
                    fallback={post.author.username}
                    size="md"
                    className="mr-3"
                  />
                </Link>
                <div>
                  <Link
                    to={`/user/${post.author.id}`}
                    className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {post.author.username}
                  </Link>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {formattedDate || "Recently posted"}
                    {isPostEdited() && (
                      <span className="ml-2 text-xs">(edited)</span>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <Link
                  key={index}
                  to={`/tag/${tag}`}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Content */}
          <div
            className="prose dark:prose-invert max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                disabled={!isAuthenticated}
                className={`flex items-center space-x-1 p-2 rounded-md transition-colors ${
                  isLiked
                    ? "text-red-500 dark:text-red-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                } ${
                  !isAuthenticated
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                <span>
                  {likesCount} {likesCount === 1 ? "like" : "likes"}
                </span>
              </button>

              <button
                onClick={handleShare}
                disabled={isSharing}
                className={`flex items-center space-x-1 p-2 rounded-md transition-colors ${
                  hasShared
                    ? "text-blue-500 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                } ${
                  isSharing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <Share2 size={20} fill={hasShared ? "currentColor" : "none"} />
                <span>
                  {isSharing
                    ? "Sharing..."
                    : `${sharesCount} ${
                        sharesCount === 1 ? "share" : "shares"
                      }`}
                </span>
              </button>
            </div>

            {isAuthor && (
              <div className="flex items-center space-x-2">
                <Link to={`/edit-post/${post.id}`}>
                  <Button variant="outline" size="sm" icon={<Edit size={16} />}>
                    Edit
                  </Button>
                </Link>

                <Button
                  variant="danger"
                  size="sm"
                  icon={<Trash2 size={16} />}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Comments section */}
      <CommentSection postId={post.id} />

      {/* Delete confirmation modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Post"
      >
        <div>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Are you sure you want to delete this post? This action cannot be
            undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PostDetailPage;
