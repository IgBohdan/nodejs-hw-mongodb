import { v2 as cloudinary } from 'cloudinary';
import { getEnvVar } from '../utils/getEnvVar.js';

cloudinary.config({
  cloud_name: getEnvVar('CLOUDINARY_CLOUD_NAME'),
  api_key: getEnvVar('CLOUDINARY_API_KEY'),
  api_secret: getEnvVar('CLOUDINARY_API_SECRET'),
});

export const uploadPhoto = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'contacts',
    });
    return result.secure_url;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to upload photo');
  }
};
