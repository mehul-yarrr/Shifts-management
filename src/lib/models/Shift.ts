import mongoose, { Schema, Model } from 'mongoose';
import type { Shift } from '@/types/shift';

const ShiftSchema = new Schema<Shift>(
  {
    employeeId: {
      type: String,
      required: true,
      ref: 'Employee',
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled',
    },
  },
  {
    timestamps: true,
  }
);

const ShiftModel: Model<Shift> = mongoose.models.Shift || mongoose.model<Shift>('Shift', ShiftSchema);

export default ShiftModel;

