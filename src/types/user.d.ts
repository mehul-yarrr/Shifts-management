export type UserRole = 'admin' | 'employee';

export interface User {
  _id?: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserPayload {
  _id: string;
  email: string;
  role: UserRole;
  name: string;
}

