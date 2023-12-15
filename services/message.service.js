import MessageModel from '../models/messageModel.js';

export const creatMessage = async (data) => {
  let newMessage = await MessageModel.create(data);
  if (!newMessage) {
    throw createHttpError.BadRequest('Oops...somthing went wrong !');
  }
  return newMessage;
};

export const populatedMessage = async (id) => {
  let msg = await MessageModel.findById(id)
    .populate({
      path: 'sender',
      select: 'name picture',
      model: 'UserModel',
    })
    .populate({
      path: 'conversation',
      select: 'name picture isGroup users',
      model: 'ConversationModel',
      populate: {
        path: 'users',
        select: 'name email picture status',
        model: 'UserModel',
      },
    });
  if (!msg) {
    throw createHttpError.BadRequest('Oops...somthing went wrong !');
  }
  return msg;
};

export const getConvoMessages = async (convoId) => {
  const message = await MessageModel.find({ conversation: convoId })
    .populate('sender', 'name email picture status')
    .populate('conversation');
  if (!message) {
    throw createHttpError.BadRequest('Oops...somthing went wrong !');
  }
  return message;
};
