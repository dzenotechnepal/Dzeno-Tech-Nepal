import { Customer } from '../models/Customer.model.js';

const customerFields = 'name company email phone address status notes createdAt updatedAt';

export const getCustomers = async (req, res) => {
  try {
    const { search, status } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const customers = await Customer.find(query).select(customerFields).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, data: customers, message: 'Customers fetched' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).select(customerFields).lean();
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    return res.status(200).json({ success: true, data: customer, message: 'Customer fetched' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const { name, company, email, phone, address, status, notes } = req.body;
    if (!name?.trim()) return res.status(400).json({ success: false, message: 'Customer name is required' });

    const customer = await Customer.create({ name, company, email, phone, address, status, notes, createdBy: req.user.id });
    return res.status(201).json({ success: true, data: customer, message: 'Customer created' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { name, company, email, phone, address, status, notes } = req.body;
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, company, email, phone, address, status, notes },
      { new: true, runValidators: true }
    ).select(customerFields);
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    return res.status(200).json({ success: true, data: customer, message: 'Customer updated' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    return res.status(200).json({ success: true, message: 'Customer deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
