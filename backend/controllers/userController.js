import User from '../models/User.js';
import { getPagination, paginatedResponse } from '../utils/pagination.js';
import { logActivity } from '../utils/activity.js';

export const listUsers = async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const search = req.query.search || '';
  const filter = search
    ? { $or: [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] }
    : {};
  const [users, total] = await Promise.all([
    User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter)
  ]);
  res.json(paginatedResponse(users, page, limit, total));
};

export const getUser = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json(user);
};

export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (String(user._id) === String(req.user._id)) {
    res.status(400);
    throw new Error('You cannot delete your own account');
  }
  await user.deleteOne();
  await logActivity(`Deleted user ${user.email}`, 'delete');
  res.json({ message: 'User deleted successfully' });
};
