import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const DeployConfigSchema = new Schema({
  name: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: 'UserProfile' },
  project: { type: Schema.Types.ObjectId, ref: 'Project' },
  serverName: { type: String, default: 'okeanos' },
  url: { type: String },
  serverIp: { type: Number },
  serverIpAddress: { type: String },
  port: { type: Number },
  frontendport: { type: Number },
  frontName: { type: String, default: 'localhost' },
  backendport: { type: Number },
  backendName: { type: String, default: 'localhost' },
  mongoSrv: { type: String }
});

export const DeployConfig = mongoose.model('deployconfig', DeployConfigSchema);
export default DeployConfig;
