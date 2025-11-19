export interface Employee {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hireDate: Date;
  status: 'active' | 'inactive';
  userId?: string; // Reference to User
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateEmployeeInput {
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hireDate: string;
  status?: 'active' | 'inactive';
}

export interface UpdateEmployeeInput extends Partial<CreateEmployeeInput> {}

