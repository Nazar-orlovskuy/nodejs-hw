import createHttpError from 'http-errors';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const updateUserAvatar = async (req, res, next) => {
  try {
    const file = req.file;

    if (!file) {
      throw createHttpError(400, 'No file');
    }

    const result = await saveFileToCloudinary(file.buffer);

    if (!result || !result.secure_url) {
      throw createHttpError(500, 'Failed to upload file');
    }

    const user = req.user;
    user.avatar = result.secure_url;
    await user.save();

    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    next(error);
  }
};
