import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contractNumber: { type: String, trim: true },
    type: { type: String, enum: ['employment', 'consultancy', 'internship', 'temporary', 'other'], default: 'employment' },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    status: { type: String, enum: ['draft', 'active', 'expired', 'terminated'], default: 'draft' },
    salary: { type: Number, min: 0, default: 0 },
    terms: { type: String, trim: true },
    documents: [{
      name: { type: String, required: true },
      url: { type: String, required: true },
      publicId: { type: String, required: true },
      resourceType: { type: String },
      mimeType: { type: String },
      size: { type: Number },
      uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      uploadedAt: { type: Date, default: Date.now },
    }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

contractSchema.index({ employeeId: 1, startDate: -1 });
contractSchema.index({ status: 1, endDate: 1 });

export const Contract = mongoose.model('Contract', contractSchema);
