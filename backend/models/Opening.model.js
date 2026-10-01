import mongoose from 'mongoose';

const openingSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    level: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

openingSchema.index({ isActive: 1, sortOrder: 1, createdAt: -1 });

export const Opening = mongoose.model('Opening', openingSchema);
