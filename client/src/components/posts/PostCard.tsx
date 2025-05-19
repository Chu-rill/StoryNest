import { format } from 'date-fns';
import { Heart, MessageCircle } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { likePost, unlikePost } from '../../api/posts';
import { useAuth } from '../../contexts/AuthContext';
import { Post } from '../../types';

interface PostCardProps {
  post: Post;
  onLikeChange?: (post: Post) => void;
}

const PostCard = ({ post, onLikeChange }: PostCardProps) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState<boolean>(
    user ? post.likes.includes(user._id) : false
  );
  const [likeCount, setLikeCount] = useState<number>(post.likes.length);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const defaultImage = 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

  const formattedDate = format(new Date(post.createdAt), 'MMM d, yyyy');

  const truncate = (text: string, length: number) => {
    if (text.length <= length) return text;
    return text.slice(0, length) + '...';
  };

  const handleLikeClick = useCallback(async () => {
    if (!user) {
      toast.info('Please log in to like posts');
      return;
    }

    setIsLoading(true);
    try {
      if (isLiked) {
        const updatedPost = await unlikePost(post._id);
        setIsLiked(false);
        setLikeCount(updatedPost.likes.length);
        if (onLikeChange) onLikeChange(updatedPost);
      } else {
        const updatedPost = await likePost(post._id);
        setIsLiked(true);
        setLikeCount(updatedPost.likes.length);
        if (onLikeChange) onLikeChange(updatedPost);
      }
    } catch (error) {
      toast.error('Failed to update like status');
    } finally {
      setIsLoading(false);
    }
  }, [isLiked, post._id, user, onLikeChange]);

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/post/${post._id}`} className="block overflow-hidden max-h-40">
        <img 
          src={post.image || defaultImage} 
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
      </Link>
      
      <div className="p-5">
        <div className="flex items-center mb-3">
          <Link 
            to={`/profile/${post.author._id}`} 
            className="flex items-center"
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-2">
              {post.author.profilePicture ? (
                <img 
                  src={post.author.profilePicture} 
                  alt={post.author.username} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-gray-600">
                  {post.author.username.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <span className="text-sm text-gray-700 hover:text-primary transition-colors">
              {post.author.username}
            </span>
          </Link>
          <span className="mx-2 text-gray-400">•</span>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>
        
        <h2 className="text-xl font-bold mb-2 hover:text-primary transition-colors">
          <Link to={`/post/${post._id}`}>
            {post.title}
          </Link>
        </h2>
        
        {post.summary && (
          <p className="text-gray-600 mb-4">
            {truncate(post.summary, 120)}
          </p>
        )}
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <button 
            onClick={handleLikeClick}
            disabled={isLoading}
            className={`flex items-center text-sm space-x-1 ${
              isLiked ? 'text-error' : 'text-gray-500 hover:text-error'
            } transition-colors focus:outline-none`}
          >
            <Heart 
              size={18} 
              className={isLiked ? 'fill-current' : ''}
            />
            <span>{likeCount}</span>
          </button>
          
          <Link 
            to={`/post/${post._id}`} 
            className="flex items-center text-sm space-x-1 text-gray-500 hover:text-primary transition-colors"
          >
            <MessageCircle size={18} />
            <span>{post.comments.length}</span>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostCard;