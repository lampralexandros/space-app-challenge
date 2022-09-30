import mongoose from 'mongoose';

const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
  githubId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  authToken: {
    type: String
  },
  email: {
    type: String
  },
  ownedProjects: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Project'
    }
  ],
  memberOfProjects: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Project'
    }
  ],
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Message'
    }
  ],
  passwordSalted: { type: String, default: undefined },

  deployConfiguration: [
    {
      type: Schema.Types.ObjectId,
      ref: 'deployconfig'
    }
  ],

  /// this could go as collection
  userPreferences: {
    hiddenProjects: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Project'
      }
    ],
    visibilityFilter: {
      type: String,
      default: 'Show all',
      enum: ['Show all', 'Show visible', 'Show non visible']
    },
    roleFilter: {
      type: String,
      default: 'Show all',
      enum: ['Show all', 'Show member', 'Show owner']
    },
    statusFilter: {
      type: String,
      default: 'Show all',
      enum: ['Show all', 'Show active', 'Show suspended']
    }
  }
});
export const UserProfile = mongoose.model('UserProfile', UserSchema);
export default UserProfile;
