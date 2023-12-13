import createHttpError from 'http-errors';
import { UserModel } from '../models/models.js';

export const findUser = async (userId) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw createHttpError.BadRequest('Please fill all fields');
  }
  return user;
};

export const searchUsers = async (keywords) => {
  const users = await UserModel.find({
    $or: [
      { name: { $regex: keywords, $options: 'i' } },
      { email: { $regex: keywords, $options: 'i' } },
    ],
  });
  return users;
};
