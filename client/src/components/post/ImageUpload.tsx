import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadImage } from '../../services/cloudinaryService';
import { Image, X, Upload, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  error?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, error }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      setIsUploading(true);
      setUploadError(null);

      try {
        const imageUrl = await uploadImage(file);
        onChange(imageUrl);
      } catch (error) {
        console.error('Upload failed:', error);
        setUploadError('Failed to upload image. Please try again.');
      } finally {
        setIsUploading(false);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    maxSize: 5242880, // 5MB
    multiple: false,
  });

  const removeImage = () => {
    onChange('');
  };

  return (
    <div className="mb-6">
      {value ? (
        <div className="relative group">
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
            <img
              src={value}
              alt="Uploaded image"
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all hover:scale-110"
          >
            <X size={18} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
            <p className="text-white text-sm font-medium">Cover Image</p>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
            ${
              isDragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105'
                : 'border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }
            ${error ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
            ${isUploading ? 'pointer-events-none' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-4">
            {isUploading ? (
              <>
                <LoadingSpinner size="lg" color="blue" />
                <div className="text-center">
                  <p className="text-blue-600 dark:text-blue-400 font-medium">Uploading image...</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Please wait while we process your image</p>
                </div>
              </>
            ) : (
              <>
                <div className="relative">
                  <Image
                    size={48}
                    className={`
                      transition-colors duration-300
                      ${
                        isDragActive
                          ? 'text-blue-600 dark:text-blue-400'
                          : error 
                          ? 'text-red-500 dark:text-red-400'
                          : 'text-gray-400 dark:text-gray-500'
                      }
                    `}
                  />
                  {error && (
                    <AlertCircle 
                      size={20} 
                      className="absolute -top-2 -right-2 text-red-500 bg-white dark:bg-gray-800 rounded-full" 
                    />
                  )}
                </div>
                
                {isDragActive ? (
                  <div className="text-center">
                    <p className="text-blue-600 dark:text-blue-400 font-medium">Drop your image here</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Release to upload</p>
                  </div>
                ) : (
                  <>
                    <div className="text-center">
                      <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">
                        Add a cover image to your post
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Drag & drop an image, or click to browse
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Supports: JPG, PNG, GIF • Max size: 5MB
                      </p>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="md"
                      icon={<Upload size={18} />}
                      className="mt-2"
                    >
                      Choose Image
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
      {(error || uploadError) && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-2">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400">
            {error || uploadError}
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;