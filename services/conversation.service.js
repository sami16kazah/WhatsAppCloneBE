import createHttpError from 'http-errors';
import ConversationModel from '../models/conversaion_model.js';
import UserModel from '../models/user_model.js';

export const doesConversationExist = async (sender_id, reciver_id) => {
  let convos = await ConversationModel.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: sender_id } } },
      { users: { $elemMatch: { $eq: reciver_id } } },
    ],
  })
    .populate('users', '-password')
    .populate('latestMessage');
  if (!convos) {
    throw createHttpError.NotFound('somtheing went wrong');
  }
  // populate msg model
  convos = await UserModel.populate(convos, {
    path: 'latestMessage.sender',
    select: 'name email picture status',
  });
  return convos[0];
};

export const createConversation = async (data) => {
  const newConvo = await ConversationModel.create(data);
  if (!newConvo) {
    throw createHttpError.BadRequest('Oops...somthing went wrong !');
  }
  return newConvo;
};

export const populateConversation = async (
  id,
  fieldToPopulate,
  fieldsToRemove
) => {
  const populatedConvo = await ConversationModel.findOne({
    _id: id,
  }).populate(fieldToPopulate, fieldsToRemove);
  if (!populatedConvo) {
    throw createHttpError.BadRequest('Oops...somthing went wrong !');
  }
  return populatedConvo;
};

export const getUserConversations = async (user_id) => {
  let convorsations;
  await ConversationModel.find({
    users: { $elemMatch: { $eq: user_id } },
  })
    .populate('users', '-password')
    .populate('admin', '-password')
    .populate('latestMessage')
    .sort({ updatedAt: -1 })
    .then(async (results) => {
      results = await UserModel.populate(results, {
        path: 'latestMessage.sender',
        select: 'name email picture status',
      });
      convorsations = results;
    })
    .catch((error) => {
      throw createHttpError.BadRequest('Oops...somthing went wrong !');
    });
  return convorsations;
};

export const updateLatestMessage = async (convo_id, msg) => {
  const UpdatedConvo = await ConversationModel.findByIdAndUpdate(convo_id, {
    latestMessage: msg,
  });
  if (!UpdatedConvo) {
    throw createHttpError.BadRequest('Oops...somthing went wrong !');
  }
  return UpdatedConvo;
};
