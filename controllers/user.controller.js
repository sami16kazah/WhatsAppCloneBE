import createHttpError from 'http-errors';
import logger from '../configs/logger.js';
import { searchUsers as searchUsersService } from '../services/user.service.js';
export const searchUsers = async (req, res, next) => {
  try {
    const keyword = req.query.search;
    if (!keyword) {
      logger.error('add search term to query ');
      throw createHttpError.BadRequest('Ooops something went wrong !');
    }
    const users = await searchUsersService(keyword, req.user.userId);
    res.json(users);
  } catch (error) {
    next(error);
  }
};
