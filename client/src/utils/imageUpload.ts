// Upload image to Cloudinary
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  
  // Configure your Cloudinary upload preset and cloud name
  formData.append('file', file);
  formData.append('upload_preset', 'blog_uploads');
  formData.append('cloud_name', 'your-cloud-name');
  
  try {
    const response = await fetch('https://api.cloudinary.com/v1_1/your-cloud-name/image/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload image');
    }
    
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};