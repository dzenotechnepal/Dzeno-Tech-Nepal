import bcrypt from 'bcryptjs';
import { User } from '../models/User.model.js';

export const registerUser = async (req, res) => {
  try {
    const { email, password, ...rest } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      email,
      password: hashedPassword,
      ...rest
    });

    await user.save();
    
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return res.status(201).json({ success: true, data: userWithoutPassword, message: 'User registered successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;
    
    const query = { isActive: true };
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (role) {
      query.role = role;
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select('name email role designation department employeeId panNumber gender age citizenshipNumber phone address isActive bankName bankAccountHolderName bankAccountNumber bankBranch ssfEnrolled avatar joiningDate createdAt')
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .sort({ createdAt: -1 })
        .lean(),
      User.countDocuments(query),
    ]);

    return res.status(200).json({ 
      success: true, 
      data: { users, total, page: Number(page), limit: Number(limit) },
      message: 'Users fetched successfully' 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, data: user, message: 'User fetched successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { password, ...updateData } = req.body;
    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    return res.status(200).json({ success: true, data: user, message: 'User updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getRoles = (req, res) => {
  return res.status(200).json({
    success: true,
    data: ['superadmin', 'admin', 'ceo', 'developer', 'employee'],
    message: 'Roles fetched'
  });
};

export const updateBankInfo = async (req, res) => {
  try {
    const { bankName, bankAccountHolderName, bankAccountNumber, bankBranch } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, {
      bankName, bankAccountHolderName, bankAccountNumber, bankBranch
    }, { new: true }).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, data: user, message: 'Bank info updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
