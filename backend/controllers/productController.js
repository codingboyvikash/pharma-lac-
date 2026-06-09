import Brand from '../models/Brand.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { getPagination, paginatedResponse } from '../utils/pagination.js';
import { logActivity } from '../utils/activity.js';

const uploadPath = (file) => `/uploads/${file.filename}`;
const parseBoolean = (value) => value === true || value === 'true';
const parseTags = (tags) => {
  if (Array.isArray(tags)) return tags;
  return String(tags || '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
};

export const productPrerequisites = async (req, res) => {
  const [categoryCount, brandCount] = await Promise.all([
    Category.countDocuments(),
    Brand.countDocuments()
  ]);
  res.json({
    categoryCount,
    brandCount,
    canCreate: categoryCount > 0 && brandCount > 0
  });
};

export const listProducts = async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const search = req.query.search || '';
  const filter = search
    ? { $or: [{ productName: new RegExp(search, 'i') }, { sku: new RegExp(search, 'i') }] }
    : {};
  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate('categoryId', 'categoryName')
      .populate('brandId', 'brandName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filter)
  ]);
  res.json(paginatedResponse(items, page, limit, total));
};

export const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('categoryId', 'categoryName')
    .populate('brandId', 'brandName');
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
};

export const createProduct = async (req, res) => {
  const [categoryCount, brandCount] = await Promise.all([
    Category.countDocuments(),
    Brand.countDocuments()
  ]);

  if (categoryCount === 0) {
    res.status(400);
    throw new Error('Please create Category first.');
  }
  if (brandCount === 0) {
    res.status(400);
    throw new Error('Please create Brand first.');
  }

  const product = await Product.create({
    ...req.body,
    tags: parseTags(req.body.tags),
    featured: parseBoolean(req.body.featured),
    trending: parseBoolean(req.body.trending),
    status: req.body.status === undefined ? true : parseBoolean(req.body.status),
    mainImage: req.files?.mainImage?.[0] ? uploadPath(req.files.mainImage[0]) : '',
    galleryImages: req.files?.galleryImages?.map(uploadPath) || []
  });
  await logActivity(`Created product ${product.productName}`, 'create');
  res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  Object.assign(product, {
    productName: req.body.productName ?? product.productName,
    categoryId: req.body.categoryId ?? product.categoryId,
    brandId: req.body.brandId ?? product.brandId,
    shortDescription: req.body.shortDescription ?? product.shortDescription,
    description: req.body.description ?? product.description,
    price: req.body.price ?? product.price,
    discountPrice: req.body.discountPrice ?? product.discountPrice,
    stock: req.body.stock ?? product.stock,
    sku: req.body.sku ?? product.sku,
    tags: req.body.tags === undefined ? product.tags : parseTags(req.body.tags),
    featured: req.body.featured === undefined ? product.featured : parseBoolean(req.body.featured),
    trending: req.body.trending === undefined ? product.trending : parseBoolean(req.body.trending),
    status: req.body.status === undefined ? product.status : parseBoolean(req.body.status)
  });

  if (req.files?.mainImage?.[0]) product.mainImage = uploadPath(req.files.mainImage[0]);
  if (req.files?.galleryImages?.length) {
    product.galleryImages = req.files.galleryImages.map(uploadPath);
  }

  await product.save();
  await logActivity(`Updated product ${product.productName}`, 'update');
  res.json(product);
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await product.deleteOne();
  await logActivity(`Deleted product ${product.productName}`, 'delete');
  res.json({ message: 'Product deleted successfully' });
};
