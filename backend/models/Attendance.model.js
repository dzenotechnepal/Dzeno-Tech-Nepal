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

export const Attendance = mongoose.model('Attendance', attendanceSchema);
