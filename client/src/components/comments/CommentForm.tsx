import { useState } from 'react';
import { toast } from 'react-toastify';
import { addComment } from '../../api/posts';
import { useAuth } from '../../contexts/AuthContext';
import { Post } from '../../types';
import Button from '../ui/Button';

interface CommentFormProps {
  postId: string;
  onCommentAdded: (updatedPost: Post) => void;
}

const CommentForm = ({ postId, onCommentAdded }: CommentFormProps) => {
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.info('Please log in to comment');
      return;
    }
    
    if (!comment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const updatedPost = await addComment(postId, { text: comment.trim() });
      onCommentAdded(updatedPost);
      setComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-4 bg-gray-50 rounded-lg">
        <p className="text-gray-600">Please log in to comment on this post.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
          {user.profilePicture ? (
            <img 
              src={user.profilePicture} 
              alt={user.username} 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm font-medium text-gray-600">
              {user.username.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        
        <div className="flex-grow">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            className="input min-h-[80px] w-full p-3"
          />
          
          <div className="mt-2 flex justify-end">
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={!comment.trim()}
            >
              Post Comment
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;