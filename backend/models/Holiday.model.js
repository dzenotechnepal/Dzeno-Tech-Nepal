import mongoose from 'mongoose';

const holidaySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    type: { type: String, enum: ['public', 'company', 'optional'], default: 'company' },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

holidaySchema.index({ date: 1, isActive: 1 });
holidaySchema.index({ name: 1 });

export const Holiday = mongoose.model('Holiday', holidaySchema);
