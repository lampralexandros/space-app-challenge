import mongoose from 'mongoose';
const Schema = mongoose.Schema;
// Create Schema
const PageSchema = new Schema({
  name: {
    type: String,
    required: true,
    default: 'Page'
  },
  data: [{ type: Object }],
  flows: [{ type: String }],
  services: [{ type: Object }],
  githubFiles: [{ type: String }],
  components: [{ type: Object }],
  styles: [{ type: Object }],
  assets: [{ type: Object }],
  image: [{ type: String }],
  actions: [{ type: Object }],
  html: { type: String, required: true, default: ' ' },
  css: { type: String, required: true, default: ' ' },
  javascript: {
    type: Object,
    required: true,
    default: { functions: [], imports: [], file: ' ', customFunctions: []}
  }
});

// module.exports = {
// Page: mongoose.model('page', PageSchema),
//   PageSchema: PageSchema
// };

export const Page = mongoose.model('page', PageSchema);
export default Page;
