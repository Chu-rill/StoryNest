import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import { toast } from 'react-toastify';
import { PostFormData } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface PostFormProps {
  initialData?: PostFormData;
  onSubmit: (data: PostFormData) => Promise<void>;
  isSubmitting: boolean;
}

const PostForm = ({ initialData, onSubmit, isSubmitting }: PostFormProps) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<PostFormData>({
    defaultValues: initialData || {
      title: '',
      summary: '',
      content: '',
    },
  });
  
  const [content, setContent] = useState<string>(initialData?.content || '');
  const [imagePreview, setImagePreview] = useState<string | null>(
    typeof initialData?.image === 'string' ? initialData.image : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Register the content field
    register('content', { required: 'Content is required' });
  }, [register]);

  const handleContentChange = (value: string) => {
    setContent(value);
    setValue('content', value);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file');
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setValue('image', file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setValue('image', undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const submitForm = async (data: PostFormData) => {
    if (!data.content || data.content.trim() === '<p><br></p>') {
      toast.error('Please enter some content for your post');
      return;
    }
    
    await onSubmit(data);
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'blockquote', 'code-block'],
      [{ color: [] }, { background: [] }],
      ['clean'],
    ],
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
      <Input
        label="Title"
        {...register('title', { required: 'Title is required' })}
        error={errors.title?.message}
        placeholder="Enter your post title"
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Summary (optional)
        </label>
        <textarea
          {...register('summary')}
          placeholder="A brief summary of your post"
          rows={3}
          className="input min-h-[80px]"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <ReactQuill
          value={content}
          onChange={handleContentChange}
          modules={quillModules}
          placeholder="Write your post content here..."
          className="h-64 mb-12"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-error">{errors.content.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Featured Image (optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          className="hidden"
          id="image-upload"
        />
        
        <div className="mt-2">
          {imagePreview ? (
            <div className="relative rounded-md overflow-hidden w-full max-w-md">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-48 object-cover" 
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-opacity"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div 
              onClick={() => document.getElementById('image-upload')?.click()}
              className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-8 h-8 text-gray-400 mb-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm text-gray-500">
                Click to upload an image or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          fullWidth={false}
        >
          {initialData ? 'Update Post' : 'Publish Post'}
        </Button>
      </div>
    </form>
  );
};

export default PostForm;