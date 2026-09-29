import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    checkIn: { type: String }, // Format: HH:MM:SS
    checkOut: { type: String }, // Format: HH:MM:SS
    status: {
      type: String,
      enum: ['present', 'absent', 'half-day', 'leave'],
      default: 'present',
    },
    workHours: { type: Number, default: 0 },
    note: { type: String },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
  },
  { timestamps: true }
);

attendanceSchema.index({ date: 1, status: 1 });
attendanceSchema.index({ employeeId: 1, year: -1, month: -1, date: -1 });

export const Attendance = mongoose.model('Attendance', attendanceSchema);
