import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { logActivity } from '../utils/activity.js';

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, role: 'admin' }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid admin credentials');
  }

  if (!user.status) {
    res.status(403);
    throw new Error('Admin account is inactive');
  }

  await logActivity(`${user.name} logged in`, 'auth');

  res.json({
    token: generateToken(user._id),
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
};

export const getProfile = async (req, res) => {
  res.json(req.user);
};
