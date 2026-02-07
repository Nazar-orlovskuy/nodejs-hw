import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const saveFileToCloudinary = (buffer, filename) => {
  return new Promise((resolve, reject) => {
    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);

    const uploadOptions = {
      folder: 'avatars',
      resource_type: 'image',
      overwrite: true,
      use_filename: true,
      unique_filename: false,
    };

    // include public_id if filename provided (without extension)
    if (filename) {
      const name = filename.replace(/\.[^/.]+$/, '');
      uploadOptions.public_id = name;
    }

    const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });

    readable.pipe(uploadStream);
  });
};
