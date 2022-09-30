import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type_app: {
    type: String,
    required: true
  },
  color_theme: {
    type: String,
    required: true
  },
  type_font: {
    type: String,
    required: true
  },
  invited_people: {
    type: [{ type: Object }],
    default: undefined
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: 'UserProfile'
    }
  ],
  date: {
    type: String,
    default: new Date().toLocaleString('en-GB').toString()
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'UserProfile'
  },
  annotations: [{ type: Object }],
  pages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'page'
    }
  ],
  // openapi: { type: Schema.Types.OjectId, ref: "openapi" }
  services: [{ type: Object }],
  customBlocks: [{type: Object}],
  data_elements: {
    data_elements_blocks: [],
    data_elements_info: []
  },
  status: {
    type: String,
    default: 'ACTIVE',
    enum: ['ACTIVE', 'SUSPENDED']
  },
  deployConfiguration: {
    type: Schema.Types.ObjectId,
    ref: 'deployconfig'
  },
  projectQuality: {
    frontEndQualityData: {
      type: Object,
      default: {OveralQualityScore: 0}
    },
    backEndQualityData: {
      type: Object,
      default: {OveralQualityScore: 0}
    }
  }
});

export const Project = mongoose.model('Project', ProjectSchema);
export default Project;
