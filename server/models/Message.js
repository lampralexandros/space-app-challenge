import mongoose from 'mongoose';

const Schema = mongoose.Schema;
// Create Schema
const MessageSchema = new Schema({
  projectName: String,
  inviterLogin: String,
  createdDate: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'UserProfile'
  },
  action: {
    type: Object,
    default: undefined
  }
});

export const Message = mongoose.model('Message', MessageSchema);
export default Message;
