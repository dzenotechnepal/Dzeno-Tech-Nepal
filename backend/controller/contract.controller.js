import { Contract } from "../models/Contract.model.js";
import { User } from "../models/User.model.js";
import cloudinary from "../config/cloudinary.js";

const fields =
  "employeeId contractNumber type startDate endDate status salary terms documents createdAt updatedAt";

const validateEmployee = async (employeeId) =>
  User.findOne({ _id: employeeId, isActive: true }).select("_id");

export const getContracts = async (req, res) => {
  try {
    const { search, status, type, employeeId } = req.query;
    const isAdmin = ["admin", "superadmin", "ceo"].includes(req.user.role);
    const query = isAdmin ? {} : { employeeId: req.user.id };
    if (status) query.status = status;
    if (type) query.type = type;
    if (employeeId && isAdmin) query.employeeId = employeeId;
    const contracts = await Contract.find(query)
      .select(fields)
      .populate("employeeId", "name employeeId email designation")
      .sort({ startDate: -1 })
      .lean();
    const filtered = search
      ? contracts.filter((contract) =>
          [
            contract.employeeId?.name,
            contract.employeeId?.employeeId,
            contract.contractNumber,
          ].some((value) => value?.toLowerCase().includes(search.toLowerCase())),
        )
      : contracts;
    return res.status(200).json({ success: true, data: filtered, message: "Contracts fetched" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadContractDocument = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "Please select a document" });
    const contract = await Contract.findById(req.params.id);
    if (!contract) return res.status(404).json({ success: false, message: "Contract not found" });

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "dzeno-tech-nepal/contracts", resource_type: "auto" },
        (error, uploadResult) => (error ? reject(error) : resolve(uploadResult)),
      );
      uploadStream.end(req.file.buffer);
    });

    contract.documents.push({
      name: req.file.originalname,
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user.id,
    });
    await contract.save();
    return res
      .status(201)
      .json({ success: true, data: contract.documents.at(-1), message: "Document uploaded" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || "Document upload failed" });
  }
};

export const deleteContractDocument = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) return res.status(404).json({ success: false, message: "Contract not found" });
    const document = contract.documents.id(req.params.documentId);
    if (!document) return res.status(404).json({ success: false, message: "Document not found" });
    await cloudinary.uploader.destroy(document.publicId, {
      resource_type: document.resourceType || "image",
    });
    document.deleteOne();
    await contract.save();
    return res.status(200).json({ success: true, message: "Document deleted" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || "Document deletion failed" });
  }
};

export const createContract = async (req, res) => {
  try {
    const { employeeId, contractNumber, type, startDate, endDate, status, salary, terms } =
      req.body;
    if (!employeeId || !startDate)
      return res
        .status(400)
        .json({ success: false, message: "Employee and start date are required" });
    if (!(await validateEmployee(employeeId)))
      return res.status(400).json({ success: false, message: "Employee not found or inactive" });
    if (endDate && new Date(endDate) < new Date(startDate))
      return res
        .status(400)
        .json({ success: false, message: "End date cannot be before start date" });
    const contract = await Contract.create({
      employeeId,
      contractNumber,
      type,
      startDate,
      endDate: endDate || undefined,
      status,
      salary,
      terms,
      createdBy: req.user.id,
    });
    await contract.populate("employeeId", "name employeeId email designation");
    return res.status(201).json({ success: true, data: contract, message: "Contract created" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateContract = async (req, res) => {
  try {
    const { employeeId, contractNumber, type, startDate, endDate, status, salary, terms } =
      req.body;
    if (!employeeId || !startDate)
      return res
        .status(400)
        .json({ success: false, message: "Employee and start date are required" });
    if (!(await validateEmployee(employeeId)))
      return res.status(400).json({ success: false, message: "Employee not found or inactive" });
    if (endDate && new Date(endDate) < new Date(startDate))
      return res
        .status(400)
        .json({ success: false, message: "End date cannot be before start date" });
    const contract = await Contract.findByIdAndUpdate(
      req.params.id,
      {
        employeeId,
        contractNumber,
        type,
        startDate,
        endDate: endDate || null,
        status,
        salary,
        terms,
      },
      { new: true, runValidators: true },
    )
      .select(fields)
      .populate("employeeId", "name employeeId email designation");
    if (!contract) return res.status(404).json({ success: false, message: "Contract not found" });
    return res.status(200).json({ success: true, data: contract, message: "Contract updated" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteContract = async (req, res) => {
  try {
    const contract = await Contract.findByIdAndDelete(req.params.id);
    if (!contract) return res.status(404).json({ success: false, message: "Contract not found" });
    return res.status(200).json({ success: true, message: "Contract deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
