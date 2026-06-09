import Brand from '../models/Brand.js';
import { getPagination, paginatedResponse } from '../utils/pagination.js';
import { logActivity } from '../utils/activity.js';

const fileUrl = (file) => (file ? `/uploads/${file.filename}` : undefined);

export const listBrands = async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const search = req.query.search || '';
  const filter = search ? { brandName: new RegExp(search, 'i') } : {};
  const [items, total] = await Promise.all([
    Brand.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Brand.countDocuments(filter)
  ]);
  res.json(paginatedResponse(items, page, limit, total));
};

export const createBrand = async (req, res) => {
  const brand = await Brand.create({
    brandName: req.body.brandName,
    logo: fileUrl(req.file) || '',
    status: req.body.status ?? true
  });
  await logActivity(`Created brand ${brand.brandName}`, 'create');
  res.status(201).json(brand);
};

export const updateBrand = async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    res.status(404);
    throw new Error('Brand not found');
  }
  brand.brandName = req.body.brandName ?? brand.brandName;
  brand.logo = fileUrl(req.file) || brand.logo;
  brand.status = req.body.status ?? brand.status;
  await brand.save();
  await logActivity(`Updated brand ${brand.brandName}`, 'update');
  res.json(brand);
};

export const deleteBrand = async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    res.status(404);
    throw new Error('Brand not found');
  }
  await brand.deleteOne();
  await logActivity(`Deleted brand ${brand.brandName}`, 'delete');
  res.json({ message: 'Brand deleted successfully' });
};
