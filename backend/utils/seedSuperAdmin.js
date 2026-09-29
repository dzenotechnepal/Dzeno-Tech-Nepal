import bcrypt from 'bcryptjs';

import { User } from '../models/User.model.js';

export async function seedSuperAdmin() {
  const email = process.env.SUPER_ADMIN_EMAIL || 'superadmin@dzenotechnepal.com.np';
  const existingSuperAdmin = await User.findOne({ email });

  if (existingSuperAdmin) {
    console.log(`Superadmin already exists: ${email}`);
    return { created: false, user: existingSuperAdmin };
  }

  const password = process.env.SUPER_ADMIN_PASSWORD || 'superadmin123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const superAdmin = await User.create({
    name: 'Super Admin',
    email,
    password: hashedPassword,
    role: 'superadmin',
    designation: 'System Administrator',
    department: 'Management',
    isActive: true,
  });

  console.log(`Superadmin seeded successfully: ${email}`);
  return { created: true, user: superAdmin };
}