import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    portfolio: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    applicationType: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ['new', 'reviewing', 'shortlisted', 'rejected', 'hired'], default: 'new' },
    adminNotes: { type: String, trim: true },
  },
  { timestamps: true }
);

jobApplicationSchema.index({ status: 1, createdAt: -1 });
jobApplicationSchema.index({ email: 1, createdAt: -1 });

export const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);
