import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import EmployeeModel from '@/lib/models/Employee';
import { validateUpdateEmployee } from '@/utils/validate';
import { requireRole } from '@/utils/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    requireRole(request, ['admin', 'employee']);

    const employee = await EmployeeModel.findById(params.id);
    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(employee);
  } catch (error: any) {
    console.error('Get employee error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'Unauthorized' || error.message === 'Forbidden' ? 401 : 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    requireRole(request, ['admin']);

    const body = await request.json();
    const data = validateUpdateEmployee(body);

    const updateData: any = { ...data };
    if (data.hireDate) {
      updateData.hireDate = new Date(data.hireDate);
    }

    const employee = await EmployeeModel.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(employee);
  } catch (error: any) {
    console.error('Update employee error:', error);
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    requireRole(request, ['admin']);

    const employee = await EmployeeModel.findByIdAndDelete(params.id);
    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Employee deleted successfully' });
  } catch (error: any) {
    console.error('Delete employee error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'Unauthorized' || error.message === 'Forbidden' ? 401 : 500 }
    );
  }
}

