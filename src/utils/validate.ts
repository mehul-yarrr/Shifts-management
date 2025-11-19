import { z } from 'zod';
import type { CreateEmployeeInput, UpdateEmployeeInput } from '@/types/employee';
import type { CreateShiftInput, UpdateShiftInput } from '@/types/shift';
import type { MarkAttendanceInput } from '@/types/attendance';

// User validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['admin', 'employee']),
});

// Employee validation schemas
export const createEmployeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 characters'),
  position: z.string().min(2, 'Position is required'),
  department: z.string().min(2, 'Department is required'),
  hireDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  status: z.enum(['active', 'inactive']).optional(),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

// Shift validation schemas
const shiftSchemaBase = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  startTime: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Start time must be in ISO format'),
  endTime: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'End time must be in ISO format'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  location: z.string().min(2, 'Location is required'),
  notes: z.string().optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled']).optional(),
});

export const createShiftSchema = shiftSchemaBase.refine((data) => {
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  return end > start;
}, {
  message: 'End time must be after start time',
  path: ['endTime'],
});

export const updateShiftSchema = shiftSchemaBase.partial().refine((data) => {
  // Only validate time relationship if both startTime and endTime are provided
  if (data.startTime && data.endTime) {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    return end > start;
  }
  return true;
}, {
  message: 'End time must be after start time',
  path: ['endTime'],
});

// Attendance validation schemas
export const markAttendanceSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  shiftId: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Check-in time must be in ISO format'),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Check-out time must be in ISO format').optional(),
  status: z.enum(['present', 'absent', 'late', 'early-leave']).optional(),
  notes: z.string().optional(),
});

// Validation functions
export function validateLogin(data: unknown) {
  return loginSchema.parse(data);
}

export function validateRegister(data: unknown) {
  return registerSchema.parse(data);
}

export function validateCreateEmployee(data: unknown): CreateEmployeeInput {
  return createEmployeeSchema.parse(data);
}

export function validateUpdateEmployee(data: unknown): UpdateEmployeeInput {
  return updateEmployeeSchema.parse(data);
}

export function validateCreateShift(data: unknown): CreateShiftInput {
  return createShiftSchema.parse(data);
}

export function validateUpdateShift(data: unknown): UpdateShiftInput {
  return updateShiftSchema.parse(data);
}

export function validateMarkAttendance(data: unknown): MarkAttendanceInput {
  return markAttendanceSchema.parse(data);
}

