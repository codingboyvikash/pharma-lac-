import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: {
      type: String,
      enum: ['about-us', 'contact-us', 'privacy-policy', 'terms-conditions'],
      unique: true,
      required: true
    },
    content: { type: String, default: '' },
    status: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('Page', pageSchema);
