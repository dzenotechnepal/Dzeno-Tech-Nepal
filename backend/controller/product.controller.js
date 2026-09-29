import { Product } from '../models/Product.model.js';
import { User } from '../models/User.model.js';

const productFields = 'name sku description category price status assignedTo createdAt updatedAt';

export const getProducts = async (req, res) => {
  try {
    const { search, status, assignedTo } = req.query;
    const query = {};
    if (status) query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(query)
      .select(productFields)
      .populate('assignedTo', 'name employeeId email')
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json({ success: true, data: products, message: 'Products fetched' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, sku, description, category, price, status, assignedTo } = req.body;
    if (!name?.trim()) return res.status(400).json({ success: false, message: 'Product name is required' });
    if (assignedTo) {
      const user = await User.findOne({ _id: assignedTo, isActive: true }).select('_id');
      if (!user) return res.status(400).json({ success: false, message: 'Assigned user not found or inactive' });
    }

    const product = await Product.create({ name, sku, description, category, price, status, assignedTo, createdBy: req.user.id });
    await product.populate('assignedTo', 'name employeeId email');
    return res.status(201).json({ success: true, data: product, message: 'Product created' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, sku, description, category, price, status, assignedTo } = req.body;
    if (!name?.trim()) return res.status(400).json({ success: false, message: 'Product name is required' });
    if (assignedTo) {
      const user = await User.findOne({ _id: assignedTo, isActive: true }).select('_id');
      if (!user) return res.status(400).json({ success: false, message: 'Assigned user not found or inactive' });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, sku, description, category, price, status, assignedTo: assignedTo || null },
      { new: true, runValidators: true }
    ).select(productFields).populate('assignedTo', 'name employeeId email');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    return res.status(200).json({ success: true, data: product, message: 'Product updated' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    return res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
