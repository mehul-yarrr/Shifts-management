export interface Attendance {
  _id?: string;
  employeeId: string;
  shiftId?: string;
  date: Date;
  checkIn: Date;
  checkOut?: Date;
  status: 'present' | 'absent' | 'late' | 'early-leave';
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MarkAttendanceInput {
  employeeId: string;
  shiftId?: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status?: 'present' | 'absent' | 'late' | 'early-leave';
  notes?: string;
}

export interface AttendanceHistoryFilters {
  employeeId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

