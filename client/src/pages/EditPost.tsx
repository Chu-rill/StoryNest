import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getPost, updatePost } from '../api/posts';
import PostForm from '../components/posts/PostForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { Post, PostFormData } from '../types';

const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const postData = await getPost(id);
        setPost(postData);
        
        // Check if current user is the author
        if (user && postData.author._id !== user._id) {
          setError("You don't have permission to edit this post");
        }
      } catch (error) {
        setError('Failed to load post');
        toast.error('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user]);

  const handleUpdatePost = async (data: PostFormData) => {
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      await updatePost(id, data);
      toast.success('Post updated successfully!');
      navigate(`/post/${id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update post');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading post..." />;
  }

  if (error) {
    return (
      <div className="container py-8 text-center">
        <div className="bg-error/10 p-6 rounded-lg">
          <h1 className="text-xl font-medium text-error mb-2">{error}</h1>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline mt-4"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-8 text-center">
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

  const initialData: PostFormData = {
    title: post.title,
    summary: post.summary || '',
    content: post.content,
    image: post.image,
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
        <PostForm 
          initialData={initialData}
          onSubmit={handleUpdatePost} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  );
};

export default EditPost;