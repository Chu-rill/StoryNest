import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { deleteComment } from '../../api/posts';
import { useAuth } from '../../contexts/AuthContext';
import { Comment, Post } from '../../types';
import Button from '../ui/Button';

interface CommentListProps {
  postId: string;
  comments: Comment[];
  onUpdate: (updatedPost: Post) => void;
}

const CommentList = ({ postId, comments, onUpdate }: CommentListProps) => {
  const { user } = useAuth();
  const [loadingCommentId, setLoadingCommentId] = useState<string | null>(null);

  const handleDelete = async (commentId: string) => {
    if (!user) return;
    
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    
    setLoadingCommentId(commentId);
    try {
      const updatedPost = await deleteComment(postId, commentId);
      onUpdate(updatedPost);
      toast.success('Comment deleted successfully');
    } catch (error) {
      toast.error('Failed to delete comment');
    } finally {
      setLoadingCommentId(null);
    }
  };

  if (comments.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div 
          key={comment._id} 
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2 overflow-hidden">
                {comment.author.profilePicture ? (
                  <img 
                    src={comment.author.profilePicture} 
                    alt={comment.author.username} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-600">
                    {comment.author.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <span className="font-medium text-sm">{comment.author.username}</span>
                <p className="text-xs text-gray-500">
                  {format(new Date(comment.createdAt), 'MMM d, yyyy • h:mm a')}
                </p>
              </div>
            </div>
            
            {(user && (user._id === comment.author._id)) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(comment._id)}
                isLoading={loadingCommentId === comment._id}
                className="text-gray-500 hover:text-error p-1"
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
          
          <p className="text-gray-700 whitespace-pre-line pl-10">{comment.text}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;