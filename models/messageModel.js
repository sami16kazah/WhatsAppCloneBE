import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;
const MessageSchema = mongoose.Schema(
  {
    message: {
      type: String,
    },
    files: [],
    sender: { type: ObjectId, ref: 'UserModel' },
    conversation: { type: ObjectId, ref: 'ConversationModel' },
  },
  {
    collection: 'messages',
    timestamps: true,
  }
);

const MessageModel =
  mongoose.models.MessageModel || mongoose.model('MessageModel', MessageSchema);

export default MessageModel;
