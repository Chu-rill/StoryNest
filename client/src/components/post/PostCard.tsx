import React from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Post } from "../../types";
import Avatar from "../ui/Avatar";
import Card, { CardBody } from "../ui/Card";
import { useAuth } from "../../contexts/AuthContext";
import { likePost, unlikePost, sharePost } from "../../services/postService";
import toast from "react-hot-toast";

interface PostCardProps {
  post: Post;
  onPostUpdate?: (updatedPost: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onPostUpdate }) => {
  const { isAuthenticated, user } = useAuth();
  const [isSharing, setIsSharing] = React.useState(false);

  // More robust isLiked check using useMemo (similar to PostDetailPage)
  const isLiked = React.useMemo(() => {
    if (!user?.id || !isAuthenticated || !post?.likes) return false;

    // Check if likes is an array (new format) or if we have isLiked property (legacy format)
    if (Array.isArray(post.likes)) {
      const found = post.likes.find((like: any) => {
        // Handle different possible formats
        if (typeof like === "string") return like === user.id;
        if (typeof like === "object" && like !== null) {
          return (
            like.id === user.id ||
            like._id === user.id ||
            like.userId === user.id
          );
        }
        return false;
      });
      return !!found;
    }

    // Fallback to isLiked property if available (legacy support)
    return post.isLiked || false;
  }, [user?.id, post?.likes, post?.isLiked, isAuthenticated]);

  // Check if user has already shared this post
  const hasShared = React.useMemo(() => {
    if (!user?.id || !isAuthenticated || !post?.shares) return false;

    // Only check if shares is an array
    if (Array.isArray(post.shares)) {
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
    }

    return false;
  }, [user?.id, post?.shares, isAuthenticated]);

  // Helper function to get likes count safely
  const getLikesCount = (): number => {
    if (!post?.likes) return 0;

    // If likes is an array, return its length
    if (Array.isArray(post.likes)) {
      return post.likes.length;
    }

    // If likes is a number (legacy format), return it directly
    if (typeof post.likes === "number") {
      return post.likes;
    }

    return 0;
  };

  // Helper function to get shares count safely
  const getSharesCount = (): number => {
    // Use shareCount if available, otherwise fall back to shares array length
    if (post?.shareCount !== undefined) return post.shareCount;
    if (!post?.shares) return 0;
    return Array.isArray(post.shares) ? post.shares.length : 0;
  };

  const handleLike = async () => {
    if (!isAuthenticated || !user) {
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
      if (updatedPost && updatedPost.id && onPostUpdate) {
        const processedPost = {
          ...updatedPost,
          likes: updatedPost.likes || [],
          tags: updatedPost.tags || [],
          shares: updatedPost.shares || post.shares || [],
          shareCount: updatedPost.shareCount || post.shareCount || 0,
        };
        onPostUpdate(processedPost);
      } else if (onPostUpdate) {
        // Fallback: manually update the likes array or count
        if (Array.isArray(post.likes)) {
          // Handle array format
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

          onPostUpdate(updatedPostData);
        } else {
          // Handle legacy number format
          const currentCount = typeof post.likes === "number" ? post.likes : 0;
          const newCount = isLiked
            ? Math.max(0, currentCount - 1)
            : currentCount + 1;

          const updatedPostData = {
            ...post,
            likes: Array(newCount).fill({ id: user.id, userId: user.id }),
          };

          onPostUpdate(updatedPostData);
        }
      }
    } catch (error) {
      console.error("Failed to update like status:", error);
      toast.error("Failed to update like status");
    }
  };

  const handleShare = async () => {
    setIsSharing(true);

    try {
      // First, record the share in the backend
      if (isAuthenticated && user) {
        try {
          const updatedPost = await sharePost(post.id);

          // Update post state with new share data
          if (updatedPost && updatedPost.post.id && onPostUpdate) {
            const processedPost = {
              ...updatedPost.post,
              likes: updatedPost.post.likes || post.likes || [],
              tags: updatedPost.post.tags || post.tags || [],
              shares: updatedPost.post.shares || [],
              shareCount: updatedPost.post.shareCount || 0,
            };
            onPostUpdate(processedPost);
          } else if (onPostUpdate) {
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

            onPostUpdate({
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
          title: post.title,
          text: post.summary,
          url: window.location.origin + "/post/" + post.id,
        });
        toast.success("Post shared successfully!");
      } else {
        // Fallback for browsers that don't support navigator.share
        await navigator.clipboard.writeText(
          window.location.origin + "/post/" + post.id
        );
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

  const likesCount = getLikesCount();
  const sharesCount = getSharesCount();

  return (
    <Card
      hoverable
      className="transition-all duration-300 mb-4 overflow-hidden"
    >
      <CardBody className="p-0">
        <div className="flex flex-col">
          {/* Post Header */}
          <div className="p-4 flex items-center space-x-3">
            {post.author && (
              <>
                <Link to={`/user/${post.author.id}`}>
                  <Avatar
                    src={post.author.profilePicture}
                    fallback={post.author.username}
                    size="md"
                  />
                </Link>
                <div className="flex-1">
                  <Link
                    to={`/user/${post.author.id}`}
                    className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {post.author.username}
                  </Link>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Post Image (if available) */}
          {post.image && (
            <Link to={`/post/${post.id}`}>
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-800">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full object-cover"
                />
              </div>
            </Link>
          )}

          {/* Post Content */}
          <div className="p-4">
            <Link to={`/post/${post.id}`} className="block mb-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                {post.title}
              </h2>
            </Link>
            <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
              {post.summary}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
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

            {/* Post Actions */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={handleLike}
                disabled={!isAuthenticated}
                className={`flex items-center space-x-1 transition-colors ${
                  isLiked
                    ? "text-red-500 dark:text-red-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                } ${
                  !isAuthenticated
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                <span>{likesCount}</span>
              </button>

              <Link
                to={`/post/${post.id}`}
                className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
              >
                <MessageCircle size={18} />
                <span>{post.commentsCount}</span>
              </Link>

              <button
                onClick={handleShare}
                disabled={isSharing}
                className={`flex items-center space-x-1 transition-colors ${
                  hasShared
                    ? "text-blue-500 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                } ${
                  isSharing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <Share2 size={18} fill={hasShared ? "currentColor" : "none"} />
                <span>{sharesCount}</span>
              </button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default PostCard;
