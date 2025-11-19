import mongoose, { Schema, Model } from 'mongoose';
import type { Attendance } from '@/types/attendance';

const AttendanceSchema = new Schema<Attendance>(
  {
    employeeId: {
      type: String,
      required: true,
      ref: 'Employee',
    },
    shiftId: {
      type: String,
      ref: 'Shift',
    },
    date: {
      type: Date,
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'early-leave'],
      default: 'present',
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const AttendanceModel: Model<Attendance> = mongoose.models.Attendance || mongoose.model<Attendance>('Attendance', AttendanceSchema);

export default AttendanceModel;

