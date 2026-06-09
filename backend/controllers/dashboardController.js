import Activity from '../models/Activity.js';
import Brand from '../models/Brand.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

export const getDashboard = async (req, res) => {
  const [totalUsers, totalCategories, totalBrands, totalProducts, activities] = await Promise.all([
    User.countDocuments(),
    Category.countDocuments(),
    Brand.countDocuments(),
    Product.countDocuments(),
    Activity.find().sort({ createdAt: -1 }).limit(10)
  ]);

  res.json({
    stats: { totalUsers, totalCategories, totalBrands, totalProducts },
    activities
  });
};
