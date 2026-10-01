import bcrypt from 'bcryptjs';
import { User } from '../models/User.model.js';
import { generateToken } from '../utils/jwt.utils.js';
import cloudinary from '../config/cloudinary.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken({ id: user._id, role: user.role });

    return res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          designation: user.designation,
          avatar: user.avatar,
        }
      },
      message: 'Login successful'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    return res.status(200).json({ success: true, data: user, message: 'User fetched successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const allowedFields = [
      'name', 'phone', 'address', 'gender', 'age', 'citizenshipNumber', 'panNumber',
      'bankName', 'bankAccountHolderName', 'bankAccountNumber', 'bankBranch', 'avatar'
    ];
    const updates = Object.fromEntries(
      allowedFields.filter(field => req.body[field] !== undefined).map(field => [field, req.body[field]])
    );
    if (updates.age !== undefined) updates.age = Number(updates.age);
    if (!updates.name?.trim() && updates.name !== undefined) {
      return res.status(400).json({ success: false, message: 'Name cannot be empty' });
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select('-password');
    return res.status(200).json({ success: true, data: user, message: 'Profile updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadMyAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select an image' });
    }

    const user = await User.findById(req.user.id).select('avatarPublicId');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'dzeno-tech-nepal/avatars', resource_type: 'image' },
        (error, uploadResult) => (error ? reject(error) : resolve(uploadResult))
      );
      uploadStream.end(req.file.buffer);
    });

    const previousPublicId = user.avatarPublicId;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: result.secure_url, avatarPublicId: result.public_id },
      { new: true }
    ).select('-password');

    if (previousPublicId && previousPublicId !== result.public_id) {
      await cloudinary.uploader.destroy(previousPublicId, { resource_type: 'image' });
    }

    return res.status(200).json({ success: true, data: updatedUser, message: 'Profile picture updated' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Profile picture upload failed' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword || newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'Use a new password with at least 8 characters' });
    }
    const user = await User.findById(req.user.id);
    
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect old password' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
