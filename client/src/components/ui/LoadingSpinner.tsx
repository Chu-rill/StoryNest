import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  fullScreen?: boolean;
  message?: string;
}

const LoadingSpinner = ({ 
  size = 24,
  fullScreen = false,
  message = 'Loading...'
}: LoadingSpinnerProps) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-50">
        <Loader2 size={size} className="animate-spin text-primary" />
        {message && <p className="mt-4 text-gray-600">{message}</p>}
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Loader2 size={size} className="animate-spin text-primary" />
      {message && <p className="mt-2 text-gray-600 text-sm">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;