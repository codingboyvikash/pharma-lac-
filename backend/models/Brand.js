import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
  {
    brandName: { type: String, required: true, trim: true },
    logo: { type: String, default: '' },
    status: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('Brand', brandSchema);
