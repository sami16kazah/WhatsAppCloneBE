import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;
const MessageSchema = mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    files: [],
    sender: { type: ObjectId, ref: 'MessageModel' },
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
