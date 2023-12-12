import logger from '../configs/logger.js';
import {
  creatMessage,
  populatedMessage,
  getConvoMessages,
} from '../services/message.service.js';
import { updateLatestMessage } from '../services/conversation.service.js';
export const sendMessage = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { message, convo_Id, files } = req.body;
    if (!convo_Id || (!message && !files)) {
      logger.error('please provide an conversation ID ');
      return res.sendStatus(400);
    }
    const msgData = {
      sender: userId,
      message,
      conversation: convo_Id,
      files: files || [],
    };
    let newMessage = await creatMessage(msgData);
    let populateMessage = await populatedMessage(newMessage._id);
    await updateLatestMessage(convo_Id, newMessage);
    res.json(populateMessage);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const conov_Id = req.params.convoId;
    if (!conov_Id) {
      logger.error('please add an conversation ID in params ');
      return res.sendStatus(400);
    }
    const messages = await getConvoMessages(conov_Id);
    res.json(messages);
  } catch (error) {
    next(error);
  }
};
