import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { createPost } from '../../services/postService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import RichTextEditor from '../../components/post/RichTextEditor';
import ImageUpload from '../../components/post/ImageUpload';
import Card, { CardBody, CardHeader, CardFooter } from '../../components/ui/Card';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Technology',
  'Travel',
  'Food',
  'Health',
  'Business',
  'Art',
  'Science',
  'Other',
];

const postSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must be at most 100 characters'),
  summary: z.string().min(10, 'Summary must be at least 10 characters').max(200, 'Summary must be at most 200 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  imageUrl: z.string().optional(),
  category: z.string().min(1, 'Please select a category'),
  tags: z.string().refine(
    (val) => {
      // Allow empty tags
      if (!val) return true;
      // Check if tags are properly formatted
      const tags = val.split(',').map((tag) => tag.trim());
      return tags.every((tag) => tag.length > 0 && tag.length <= 20 && /^[a-zA-Z0-9_-]+$/.test(tag));
    },
    {
      message: 'Tags must be separated by commas and only contain letters, numbers, underscores, or hyphens',
    }
  ),
});

type PostFormData = z.infer<typeof postSchema>;

const CreatePostPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      summary: '',
      content: '',
      imageUrl: '',
      category: '',
      tags: '',
    },
  });

  const onSubmit = async (data: PostFormData) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      // Transform tags from comma-separated string to array
      const tagsArray = data.tags
        ? data.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [];
      
      const postData = {
        ...data,
        tags: tagsArray,
      };
      
      const newPost = await createPost(postData);
      toast.success('Post created successfully!');
      navigate(`/post/${newPost.id}`);
    } catch (error) {
      console.error('Failed to create post:', error);
      toast.error('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Create New Post</h1>
      
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Title"
              type="text"
              placeholder="Enter your post title"
              {...register('title')}
              error={errors.title?.message}
              fullWidth
            />

            <TextArea
              label="Summary"
              placeholder="Write a brief summary of your post"
              {...register('summary')}
              error={errors.summary?.message}
              fullWidth
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  {...register('category')}
                  className={`
                    w-full px-4 py-2 bg-white dark:bg-gray-800 border 
                    ${errors.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} 
                    rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    text-gray-900 dark:text-gray-100
                  `}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.category.message}</p>
                )}
              </div>

              <Input
                label="Tags (comma separated)"
                type="text"
                placeholder="reactjs, webdev, tutorial"
                {...register('tags')}
                error={errors.tags?.message}
                fullWidth
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cover Image
              </label>
              <Controller
                name="imageUrl"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    value={field.value || ''}
                    onChange={field.onChange}
                    error={errors.imageUrl?.message}
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content
              </label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.content?.message}
                  />
                )}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Create Post
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default CreatePostPage;