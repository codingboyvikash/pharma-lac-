import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    categoryName: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    status: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('Category', categorySchema);
