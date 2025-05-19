import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createPost } from '../api/posts';
import PostForm from '../components/posts/PostForm';
import { PostFormData } from '../types';

const CreatePost = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreatePost = async (data: PostFormData) => {
    setIsSubmitting(true);
    
    try {
      const newPost = await createPost(data);
      toast.success('Post created successfully!');
      navigate(`/post/${newPost._id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
        <PostForm 
          onSubmit={handleCreatePost} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  );
};

export default CreatePost;