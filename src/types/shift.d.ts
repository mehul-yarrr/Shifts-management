export interface Shift {
  _id?: string;
  employeeId: string;
  startTime: Date;
  endTime: Date;
  date: Date;
  location: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateShiftInput {
  employeeId: string;
  startTime: string;
  endTime: string;
  date: string;
  location: string;
  notes?: string;
  status?: 'scheduled' | 'completed' | 'cancelled';
}

export interface UpdateShiftInput extends Partial<CreateShiftInput> {}

