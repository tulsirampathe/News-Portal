import cloudinary from '../config/cloudinary.js';
import ApiError from './ApiError.js';

// Upload file to cloudinary
export const uploadToCloudinary = async (file, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          reject(new ApiError('File upload failed', 500));
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(file.buffer);
  });
};

// Delete file from cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new ApiError('File deletion failed', 500);
  }
};

// Extract public ID from Cloudinary URL
export const getPublicIdFromUrl = (url) => {
  const matches = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.(?:jpg|jpeg|png|webp|gif|bmp|tiff|svg|mp4|mov|avi|mkv|flv|wmv|mp3|wav|ogg|aac|flac)/i);
  return matches ? matches[1] : null;
};

// Process multiple file uploads
export const processFileUploads = async (files) => {
  const uploadResults = {
    imageUrl: null,
    videoUrl: null,
    audioUrl: null,
  };

  // Process image
  if (files.imageUrl && files.imageUrl[0]) {
    const imageResult = await uploadToCloudinary(files.imageUrl[0], 'news-portal/images');
    uploadResults.imageUrl = imageResult.secure_url;
  }

  // Process video
  if (files.videoUrl && files.videoUrl[0]) {
    const videoResult = await uploadToCloudinary(files.videoUrl[0], 'news-portal/videos');
    uploadResults.videoUrl = videoResult.secure_url;
  }

  // Process audio
  if (files.audioUrl && files.audioUrl[0]) {
    const audioResult = await uploadToCloudinary(files.audioUrl[0], 'news-portal/audio');
    uploadResults.audioUrl = audioResult.secure_url;
  }

  return uploadResults;
};
