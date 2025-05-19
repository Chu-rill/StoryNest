import { format } from 'date-fns';
import { Edit, Heart, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getPost, likePost, unlikePost } from '../api/posts';
import CommentForm from '../components/comments/CommentForm';
import CommentList from '../components/comments/CommentList';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import FollowButton from '../components/user/FollowButton';
import { useAuth } from '../contexts/AuthContext';
import { Post } from '../types';

const PostDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);

  const defaultImage = 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const fetchedPost = await getPost(id);
        setPost(fetchedPost);
        
        // Check if current user has liked this post
        if (user && fetchedPost.likes.includes(user._id)) {
          setIsLiked(true);
        }
        
        setLikeCount(fetchedPost.likes.length);
      } catch (error) {
        toast.error('Failed to load post');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user, navigate]);

  const handleLikeClick = async () => {
    if (!user) {
      toast.info('Please log in to like posts');
      return;
    }
    
    if (!post) return;
    
    setLikeLoading(true);
    try {
      if (isLiked) {
        const updatedPost = await unlikePost(post._id);
        setIsLiked(false);
        setLikeCount(updatedPost.likes.length);
      } else {
        const updatedPost = await likePost(post._id);
        setIsLiked(true);
        setLikeCount(updatedPost.likes.length);
      }
    } catch (error) {
      toast.error('Failed to update like status');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const updatePost = (updatedPost: Post) => {
    setPost(updatedPost);
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading post..." />;
  }

  if (!post) {
    return (
      <div className="container py-12 text-center">
        <div className="bg-gray-100 p-6 rounded-lg">
          <h1 className="text-xl font-medium mb-2">Post not found</h1>
          <button
            onClick={() => navigate('/')}
            className="btn btn-outline mt-4"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      {/* Post header */}
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center">
            <Link to={`/profile/${post.author._id}`} className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
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
              <div>
                <p className="font-medium">{post.author.username}</p>
                <p className="text-sm text-gray-500">
                  {format(new Date(post.createdAt), 'MMM d, yyyy')}
                </p>
              </div>
            </Link>
            
            <FollowButton targetUser={post.author} />
          </div>
          
          {/* Post actions */}
          <div className="flex space-x-2">
            <button
              onClick={handleLikeClick}
              disabled={likeLoading}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md ${
                isLiked 
                  ? 'bg-error/10 text-error' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition-colors`}
            >
              <Heart 
                size={18} 
                className={isLiked ? 'fill-current' : ''}
              />
              <span>{likeCount}</span>
            </button>
            
            <button
              onClick={handleShareClick}
              className="flex items-center space-x-1 px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <Share2 size={18} />
              <span>Share</span>
            </button>
            
            {user && user._id === post.author._id && (
              <Link
                to={`/edit-post/${post._id}`}
                className="flex items-center space-x-1 px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <Edit size={18} />
                <span>Edit</span>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Post content */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        {post.image && (
          <div className="max-h-96 overflow-hidden">
            <img 
              src={post.image || defaultImage} 
              alt={post.title}
              className="w-full object-cover"
            />
          </div>
        )}
        
        <div className="p-6">
          {post.summary && (
            <div className="text-lg font-medium text-gray-700 mb-6 italic">
              {post.summary}
            </div>
          )}
          
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </div>
      </div>
      
      {/* Comments section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">
          Comments ({post.comments.length})
        </h2>
        
        <CommentForm 
          postId={post._id} 
          onCommentAdded={updatePost} 
        />
        
        <div className="mt-8">
          <CommentList 
            postId={post._id} 
            comments={post.comments}
            onUpdate={updatePost}
          />
        </div>
      </div>
    </div>
  );
};

export default PostDetails;