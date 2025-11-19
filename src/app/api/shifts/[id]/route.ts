import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ShiftModel from '@/lib/models/Shift';
import { validateUpdateShift } from '@/utils/validate';
import { requireRole } from '@/utils/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    requireRole(request, ['admin', 'employee']);

    const shift = await ShiftModel.findById(params.id);
    if (!shift) {
      return NextResponse.json(
        { error: 'Shift not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(shift);
  } catch (error: any) {
    console.error('Get shift error:', error);
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
    const data = validateUpdateShift(body);

    const updateData: any = { ...data };
    if (data.startTime) updateData.startTime = new Date(data.startTime);
    if (data.endTime) updateData.endTime = new Date(data.endTime);
    if (data.date) updateData.date = new Date(data.date);

    const shift = await ShiftModel.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!shift) {
      return NextResponse.json(
        { error: 'Shift not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(shift);
  } catch (error: any) {
    console.error('Update shift error:', error);
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

    const shift = await ShiftModel.findByIdAndDelete(params.id);
    if (!shift) {
      return NextResponse.json(
        { error: 'Shift not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Shift deleted successfully' });
  } catch (error: any) {
    console.error('Delete shift error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'Unauthorized' || error.message === 'Forbidden' ? 401 : 500 }
    );
  }
}

