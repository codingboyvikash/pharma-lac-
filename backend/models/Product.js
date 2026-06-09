import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true, trim: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    shortDescription: { type: String, trim: true },
    description: { type: String },
    mainImage: { type: String, default: '' },
    galleryImages: [{ type: String }],
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: 0, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    sku: { type: String, required: true, unique: true, trim: true },
    tags: [{ type: String, trim: true }],
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    status: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
