import createHttpError from 'http-errors';
import logger from '../configs/logger.js';
import {
  doesConversationExist,
  createConversation,
  populateConversation,
  getUserConversations,
} from '../services/conversation.service.js';
import { findUser } from '../services/user.service.js';

export const creatOpenConversation = async (req, res, next) => {
  try {
    const sender_id = req.user.userId;
    const { reciver_id } = req.body;
    // check if reciver exist
    if (!reciver_id) {
      logger.error('please provide id you want to start conv with');
      throw createHttpError.BadGateway('something went wrong');
    }
    // check if chat exist
    const existed_conversation = await doesConversationExist(
      sender_id,
      reciver_id
    );
    if (existed_conversation) {
      res.json(existed_conversation);
    } else {
      let reciverUser = await findUser(reciver_id);
      let convoData = {
        name: reciverUser.name,
        picture: reciverUser.picture,
        isGroup: false,
        users: [sender_id, reciver_id],
      };
      const newConvo = await createConversation(convoData);
      const populatedConvo = await populateConversation(
        newConvo._id,
        'users',
        '-password'
      );
      res.json(populatedConvo);
    }
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const user_id = req.user.userId;
    const conversations = await getUserConversations(user_id);
    res.json(conversations);
  } catch (error) {
    next(error);
  }
};
