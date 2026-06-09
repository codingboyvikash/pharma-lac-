import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../config/db.js';
import User from '../models/User.js';

await connectDB();

const email = process.env.ADMIN_EMAIL || 'admin@example.com';
const existing = await User.findOne({ email });

if (!existing) {
  await User.create({
    name: process.env.ADMIN_NAME || 'Admin',
    email,
    password: process.env.ADMIN_PASSWORD || 'Admin@12345',
    role: 'admin',
    status: true
  });
  console.log(`Admin user created: ${email}`);
} else {
  console.log(`Admin user already exists: ${email}`);
}

process.exit(0);
