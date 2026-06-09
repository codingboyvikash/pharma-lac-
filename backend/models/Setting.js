import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'E-commerce Admin' },
    siteLogo: { type: String, default: '' },
    favicon: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model('Setting', settingSchema);
