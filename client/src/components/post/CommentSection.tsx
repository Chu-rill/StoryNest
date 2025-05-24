import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";
import { Comment } from "../../types";
import {
  getComments,
  addComment,
  deleteComment,
} from "../../services/postService";
import { useAuth } from "../../contexts/AuthContext";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import TextArea from "../ui/TextArea";
import toast from "react-hot-toast";

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const fetchedComments = await getComments(postId);
        setComments(fetchedComments.comments);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };

    fetchComments();
  }, [postId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please log in to comment");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      await addComment(postId, newComment);

      // Refetch all comments instead of relying on the returned comment
      const fetchedComments = await getComments(postId);
      setComments(fetchedComments.comments);

      setNewComment("");
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Comment error:", error);
      toast.error("Failed to add comment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(postId, commentId);
      setComments(comments.filter((comment) => comment.id !== commentId));
      toast.success("Comment deleted successfully");
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Comments ({comments.length})
      </h3>

      {/* Comment form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <TextArea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            fullWidth
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading} isLoading={isLoading}>
              Post Comment
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            Please{" "}
            <a
              href="/login"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              log in
            </a>{" "}
            to comment.
          </p>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start">
                <Avatar
                  src={comment.author.profilePicture}
                  fallback={comment.author.username}
                  size="sm"
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white mr-2">
                        {comment.author.username}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    {user && comment.author.id === user.id && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">
                    {comment.text}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 italic">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
