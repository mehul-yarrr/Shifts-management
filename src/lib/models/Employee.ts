import mongoose, { Schema, Model } from 'mongoose';
import type { Employee } from '@/types/employee';

const EmployeeSchema = new Schema<Employee>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    hireDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    userId: {
      type: String,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const EmployeeModel: Model<Employee> = mongoose.models.Employee || mongoose.model<Employee>('Employee', EmployeeSchema);

export default EmployeeModel;

