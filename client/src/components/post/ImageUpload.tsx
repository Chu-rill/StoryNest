import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadImage } from '../../services/cloudinaryService';
import { Image, X, Upload } from 'lucide-react';
import Button from '../ui/Button';

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
    <div className="mb-4">
      {value ? (
        <div className="relative">
          <div className="aspect-w-16 aspect-h-9 rounded-md overflow-hidden bg-gray-50 dark:bg-gray-800">
            <img
              src={value}
              alt="Uploaded image"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 p-1 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors
            ${
              isDragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500'
            }
            ${error ? 'border-red-500' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-2">
            <Image
              size={36}
              className={`
                ${
                  isDragActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-400 dark:text-gray-600'
                }
              `}
            />
            {isUploading ? (
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-gray-600 dark:text-gray-400">Uploading...</span>
              </div>
            ) : isDragActive ? (
              <p className="text-blue-600 dark:text-blue-400">Drop the file here</p>
            ) : (
              <>
                <p className="text-gray-600 dark:text-gray-400">
                  Drag & drop an image, or click to select
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Maximum file size: 5MB
                </p>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  icon={<Upload size={16} />}
                >
                  Upload Image
                </Button>
              </>
            )}
          </div>
        </div>
      )}
      {(error || uploadError) && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-500">
          {error || uploadError}
        </p>
      )}
    </div>
  );
};

export default ImageUpload;