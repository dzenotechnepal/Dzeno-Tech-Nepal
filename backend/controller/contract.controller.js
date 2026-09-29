import { Contract } from '../models/Contract.model.js';
import { User } from '../models/User.model.js';

const fields = 'employeeId contractNumber type startDate endDate status salary terms createdAt updatedAt';

const validateEmployee = async (employeeId) => User.findOne({ _id: employeeId, isActive: true }).select('_id');

export const getContracts = async (req, res) => {
  try {
    const { search, status, type, employeeId } = req.query;
    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    if (employeeId) query.employeeId = employeeId;
    const contracts = await Contract.find(query)
      .select(fields)
      .populate('employeeId', 'name employeeId email designation')
      .sort({ startDate: -1 })
      .lean();
    const filtered = search
      ? contracts.filter(contract => [contract.employeeId?.name, contract.employeeId?.employeeId, contract.contractNumber].some(value => value?.toLowerCase().includes(search.toLowerCase())))
      : contracts;
    return res.status(200).json({ success: true, data: filtered, message: 'Contracts fetched' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createContract = async (req, res) => {
  try {
    const { employeeId, contractNumber, type, startDate, endDate, status, salary, terms } = req.body;
    if (!employeeId || !startDate) return res.status(400).json({ success: false, message: 'Employee and start date are required' });
    if (!(await validateEmployee(employeeId))) return res.status(400).json({ success: false, message: 'Employee not found or inactive' });
    if (endDate && new Date(endDate) < new Date(startDate)) return res.status(400).json({ success: false, message: 'End date cannot be before start date' });
    const contract = await Contract.create({ employeeId, contractNumber, type, startDate, endDate: endDate || undefined, status, salary, terms, createdBy: req.user.id });
    await contract.populate('employeeId', 'name employeeId email designation');
    return res.status(201).json({ success: true, data: contract, message: 'Contract created' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateContract = async (req, res) => {
  try {
    const { employeeId, contractNumber, type, startDate, endDate, status, salary, terms } = req.body;
    if (!employeeId || !startDate) return res.status(400).json({ success: false, message: 'Employee and start date are required' });
    if (!(await validateEmployee(employeeId))) return res.status(400).json({ success: false, message: 'Employee not found or inactive' });
    if (endDate && new Date(endDate) < new Date(startDate)) return res.status(400).json({ success: false, message: 'End date cannot be before start date' });
    const contract = await Contract.findByIdAndUpdate(req.params.id, { employeeId, contractNumber, type, startDate, endDate: endDate || null, status, salary, terms }, { new: true, runValidators: true }).select(fields).populate('employeeId', 'name employeeId email designation');
    if (!contract) return res.status(404).json({ success: false, message: 'Contract not found' });
    return res.status(200).json({ success: true, data: contract, message: 'Contract updated' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteContract = async (req, res) => {
  try {
    const contract = await Contract.findByIdAndDelete(req.params.id);
    if (!contract) return res.status(404).json({ success: false, message: 'Contract not found' });
    return res.status(200).json({ success: true, message: 'Contract deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
