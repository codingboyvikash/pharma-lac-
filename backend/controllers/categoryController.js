import slugify from 'slugify';
import Category from '../models/Category.js';
import { getPagination, paginatedResponse } from '../utils/pagination.js';
import { logActivity } from '../utils/activity.js';

const normalizeSlug = (name, slug) => slugify(slug || name, { lower: true, strict: true });

export const listCategories = async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const search = req.query.search || '';
  const filter = search ? { categoryName: new RegExp(search, 'i') } : {};
  const [items, total] = await Promise.all([
    Category.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Category.countDocuments(filter)
  ]);
  res.json(paginatedResponse(items, page, limit, total));
};

export const createCategory = async (req, res) => {
  const category = await Category.create({
    categoryName: req.body.categoryName,
    slug: normalizeSlug(req.body.categoryName, req.body.slug),
    status: req.body.status ?? true
  });
  await logActivity(`Created category ${category.categoryName}`, 'create');
  res.status(201).json(category);
};

export const updateCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  category.categoryName = req.body.categoryName ?? category.categoryName;
  category.slug = normalizeSlug(category.categoryName, req.body.slug ?? category.slug);
  category.status = req.body.status ?? category.status;
  await category.save();
  await logActivity(`Updated category ${category.categoryName}`, 'update');
  res.json(category);
};

export const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  await category.deleteOne();
  await logActivity(`Deleted category ${category.categoryName}`, 'delete');
  res.json({ message: 'Category deleted successfully' });
};
