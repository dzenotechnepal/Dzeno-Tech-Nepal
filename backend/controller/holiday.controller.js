import { Holiday } from '../models/Holiday.model.js';

const fields = 'name date type description isActive createdAt updatedAt';

export const getHolidays = async (req, res) => {
  try {
    const { year, search, isActive } = req.query;
    const query = {};
    if (year) {
      const numericYear = Number(year);
      query.date = { $gte: new Date(`${numericYear}-01-01`), $lt: new Date(`${numericYear + 1}-01-01`) };
    }
    if (search) query.name = { $regex: search, $options: 'i' };
    if (isActive !== undefined && isActive !== '') query.isActive = isActive === 'true';

    const holidays = await Holiday.find(query).select(fields).sort({ date: 1 }).lean();
    return res.status(200).json({ success: true, data: holidays, message: 'Holidays fetched' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createHoliday = async (req, res) => {
  try {
    const { name, date, type, description, isActive } = req.body;
    if (!name?.trim() || !date) return res.status(400).json({ success: false, message: 'Holiday name and date are required' });
    const holiday = await Holiday.create({ name, date, type, description, isActive, createdBy: req.user.id });
    return res.status(201).json({ success: true, data: holiday, message: 'Holiday created' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateHoliday = async (req, res) => {
  try {
    const { name, date, type, description, isActive } = req.body;
    if (!name?.trim() || !date) return res.status(400).json({ success: false, message: 'Holiday name and date are required' });
    const holiday = await Holiday.findByIdAndUpdate(req.params.id, { name, date, type, description, isActive }, { new: true, runValidators: true }).select(fields);
    if (!holiday) return res.status(404).json({ success: false, message: 'Holiday not found' });
    return res.status(200).json({ success: true, data: holiday, message: 'Holiday updated' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteHoliday = async (req, res) => {
  try {
    const holiday = await Holiday.findByIdAndDelete(req.params.id);
    if (!holiday) return res.status(404).json({ success: false, message: 'Holiday not found' });
    return res.status(200).json({ success: true, message: 'Holiday deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
