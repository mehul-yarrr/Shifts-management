import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import EmployeeModel from '@/lib/models/Employee';
import { validateCreateEmployee } from '@/utils/validate';
import { requireRole } from '@/utils/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    requireRole(request, ['admin', 'employee']);

    const employees = await EmployeeModel.find().sort({ createdAt: -1 });
    return NextResponse.json(employees);
  } catch (error: any) {
    console.error('Get employees error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'Unauthorized' || error.message === 'Forbidden' ? 401 : 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    requireRole(request, ['admin']);

    const body = await request.json();
    const data = validateCreateEmployee(body);

    const existingEmployee = await EmployeeModel.findOne({ email: data.email });
    if (existingEmployee) {
      return NextResponse.json(
        { error: 'Employee with this email already exists' },
        { status: 400 }
      );
    }

    const employee = await EmployeeModel.create({
      ...data,
      hireDate: new Date(data.hireDate),
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error: any) {
    console.error('Create employee error:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'Unauthorized' || error.message === 'Forbidden' ? 401 : 500 }
    );
  }
}

