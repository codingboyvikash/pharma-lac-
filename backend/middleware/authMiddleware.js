import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401);
      throw new Error('Not authorized, token missing');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user || !req.user.status) {
      res.status(401);
      throw new Error('Not authorized');
    }
    next();
  } catch (error) {
    res.status(401);
    next(new Error(error.message || 'Not authorized, token invalid'));
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  res.status(403);
  throw new Error('Admin access required');
};
