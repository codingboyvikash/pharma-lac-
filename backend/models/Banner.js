import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    link: { type: String, default: '' },
    images: { type: [String], default: [] },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('Banner', bannerSchema);
