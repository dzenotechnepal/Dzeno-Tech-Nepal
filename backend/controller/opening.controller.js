import { Opening } from '../models/Opening.model.js';

export const getPublicOpenings = async (req, res) => {
  try {
    const openings = await Opening.find({ isActive: true })
      .select('role type level description sortOrder')
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();
    return res.status(200).json({ success: true, data: openings, message: 'Open positions fetched' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getOpenings = async (req, res) => {
  try {
    const openings = await Opening.find().sort({ isActive: -1, sortOrder: 1, createdAt: -1 }).lean();
    return res.status(200).json({ success: true, data: openings, message: 'Openings fetched' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createOpening = async (req, res) => {
  try {
    const { role, type, level, description, isActive, sortOrder } = req.body;
    if (!role?.trim() || !type?.trim() || !level?.trim()) {
      return res.status(400).json({ success: false, message: 'Role, type, and level are required' });
    }
    const opening = await Opening.create({ role, type, level, description, isActive, sortOrder, createdBy: req.user.id });
    return res.status(201).json({ success: true, data: opening, message: 'Opening created' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOpening = async (req, res) => {
  try {
    const { role, type, level, description, isActive, sortOrder } = req.body;
    const opening = await Opening.findByIdAndUpdate(
      req.params.id,
      { role, type, level, description, isActive, sortOrder },
      { new: true, runValidators: true }
    );
    if (!opening) return res.status(404).json({ success: false, message: 'Opening not found' });
    return res.status(200).json({ success: true, data: opening, message: 'Opening updated' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteOpening = async (req, res) => {
  try {
    const opening = await Opening.findByIdAndDelete(req.params.id);
    if (!opening) return res.status(404).json({ success: false, message: 'Opening not found' });
    return res.status(200).json({ success: true, message: 'Opening deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
