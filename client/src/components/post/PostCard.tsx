import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Post } from '../../types';
import Avatar from '../ui/Avatar';
import Card, { CardBody } from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { likePost, unlikePost } from '../../services/postService';
import toast from 'react-hot-toast';

interface PostCardProps {
  post: Post;
  onPostUpdate?: (updatedPost: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onPostUpdate }) => {
  const { isAuthenticated } = useAuth();
  
  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to like posts');
      return;
    }
    
    try {
      const updatedPost = post.isLiked
        ? await unlikePost(post.id)
        : await likePost(post.id);
      
      if (onPostUpdate) {
        onPostUpdate(updatedPost);
      }
    } catch (error) {
      toast.error('Failed to update like status');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: post.title,
          text: post.summary,
          url: window.location.origin + '/post/' + post.id,
        })
        .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.origin + '/post/' + post.id);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <Card hoverable className="transition-all duration-300 mb-4 overflow-hidden">
      <CardBody className="p-0">
        <div className="flex flex-col">
          {/* Post Header */}
          <div className="p-4 flex items-center space-x-3">
            <Link to={`/user/${post.author.id}`}>
              <Avatar 
                src={post.author.profilePicture} 
                fallback={post.author.username} 
                size="md" 
              />
            </Link>
            <div className="flex-1">
              <Link to={`/user/${post.author.id}`} className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                {post.author.username}
              </Link>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          {/* Post Image (if available) */}
          {post.imageUrl && (
            <Link to={`/post/${post.id}`}>
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-800">
                <img 
                  src={post.imageUrl} 
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
                className={`flex items-center space-x-1 ${
                  post.isLiked 
                    ? 'text-red-500 dark:text-red-400' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
                }`}
              >
                <Heart size={18} fill={post.isLiked ? 'currentColor' : 'none'} />
                <span>{post.likes}</span>
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
                className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default PostCard;