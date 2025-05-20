import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { getUserProfile } from '../../services/authService';
import { uploadImage } from '../../services/cloudinaryService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  bio: z.string().max(200, 'Bio must be at most 200 characters').optional(),
  email: z.string().email('Please enter a valid email address'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const EditProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | undefined>(user?.profilePicture);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userData = await getUserProfile();
        reset({
          username: userData.username,
          email: userData.email,
          bio: userData.bio || '',
        });
        setProfilePicture(userData.profilePicture);
      } catch (error) {
        console.error('Failed to load user profile:', error);
        toast.error('Failed to load user profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [reset]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFileUploadError('File size must be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setFileUploadError('File must be an image');
      return;
    }

    try {
      setFileUploadError(null);
      const imageUrl = await uploadImage(file);
      setProfilePicture(imageUrl);
    } catch (error) {
      console.error('Failed to upload image:', error);
      setFileUploadError('Failed to upload image. Please try again.');
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      await updateProfile({
        ...data,
        profilePicture,
      });
      toast.success('Profile updated successfully');
      navigate('/profile');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Profile</h1>
      
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <div className="relative">
              <Avatar 
                src={profilePicture} 
                fallback={user?.username} 
                size="xl" 
              />
              <label 
                htmlFor="profilePicture" 
                className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 rounded-full p-1 cursor-pointer border border-gray-300 dark:border-gray-600 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="file"
                  id="profilePicture"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {user?.username}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Change your profile picture
              </p>
              {fileUploadError && (
                <p className="text-sm text-red-600 dark:text-red-500 mt-1">
                  {fileUploadError}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Username"
              type="text"
              {...register('username')}
              error={errors.username?.message}
              fullWidth
            />

            <Input
              label="Email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              fullWidth
            />

            <TextArea
              label="Bio"
              placeholder="Tell us a bit about yourself..."
              {...register('bio')}
              error={errors.bio?.message}
              fullWidth
            />

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/profile')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default EditProfilePage;