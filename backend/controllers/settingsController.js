import User from '../models/User.js';
import Setting from '../models/Setting.js';
import { logActivity } from '../utils/activity.js';

const getSingletonSettings = async () => {
  let settings = await Setting.findOne();
  if (!settings) settings = await Setting.create({});
  return settings;
};

export const getSettings = async (req, res) => {
  res.json(await getSingletonSettings());
};

export const updateSettings = async (req, res) => {
  const settings = await getSingletonSettings();
  settings.siteName = req.body.siteName ?? settings.siteName;
  if (req.files?.siteLogo?.[0]) settings.siteLogo = `/uploads/${req.files.siteLogo[0].filename}`;
  if (req.files?.favicon?.[0]) settings.favicon = `/uploads/${req.files.favicon[0].filename}`;
  if (req.body.faq) {
    try {
      settings.faq = typeof req.body.faq === 'string' ? JSON.parse(req.body.faq) : req.body.faq;
    } catch (err) {
      // if parsing fails, ignore or keep existing
      // fallback: if it's already an array-like value, assign it
      if (Array.isArray(req.body.faq)) settings.faq = req.body.faq;
    }
  }
  await settings.save();
  await logActivity('Updated site settings', 'update');
  res.json(settings);
};

export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.name = req.body.name ?? user.name;
  user.email = req.body.email ?? user.email;
  user.phone = req.body.phone ?? user.phone;
  await user.save();
  await logActivity('Updated admin profile', 'update');
  res.json({ id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role });
};

export const changePassword = async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  const valid = await user.matchPassword(req.body.currentPassword);
  if (!valid) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }
  user.password = req.body.newPassword;
  await user.save();
  await logActivity('Changed admin password', 'auth');
  res.json({ message: 'Password changed successfully' });
};
