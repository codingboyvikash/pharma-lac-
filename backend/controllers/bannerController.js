import Banner from '../models/Banner.js';
import { logActivity } from '../utils/activity.js';

export const getBanners = async (req, res) => {
  const banners = await Banner.find().sort({ createdAt: -1 });
  res.json(banners);
};

export const createBanner = async (req, res) => {
  if (!req.body.title) {
    res.status(400);
    throw new Error('Title is required');
  }
  const imagePaths = (req.files || []).map((f) => `/uploads/${f.filename}`);
  const banner = new Banner({
    title: req.body.title,
    link: req.body.link || '',
    images: imagePaths
  });
  await banner.save();
  await logActivity('Created banner', 'create');
  res.json(banner);
};

export const updateBanner = async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) {
    res.status(404);
    throw new Error('Banner not found');
  }
  banner.title = req.body.title ?? banner.title;
  banner.link = req.body.link ?? banner.link;
  const newImages = (req.files || []).map((f) => `/uploads/${f.filename}`);
  if (newImages.length) banner.images = banner.images.concat(newImages);
  if (req.body.active !== undefined) banner.active = req.body.active === 'true' || req.body.active === true;
  await banner.save();
  await logActivity('Updated banner', 'update');
  res.json(banner);
};

export const deleteBanner = async (req, res) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);
  if (!banner) {
    res.status(404);
    throw new Error('Banner not found');
  }
  await logActivity('Deleted banner', 'delete');
  res.json({ message: 'Banner deleted' });
};
