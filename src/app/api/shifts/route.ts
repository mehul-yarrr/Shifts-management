import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ShiftModel from '@/lib/models/Shift';
import { validateCreateShift } from '@/utils/validate';
import { requireRole } from '@/utils/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    requireRole(request, ['admin', 'employee']);

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const date = searchParams.get('date');

    const query: any = {};
    if (employeeId) query.employeeId = employeeId;
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const shifts = await ShiftModel.find(query).sort({ date: -1, startTime: 1 });
    return NextResponse.json(shifts);
  } catch (error: any) {
    console.error('Get shifts error:', error);
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
    const data = validateCreateShift(body);

    const shift = await ShiftModel.create({
      ...data,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      date: new Date(data.date),
    });

    return NextResponse.json(shift, { status: 201 });
  } catch (error: any) {
    console.error('Create shift error:', error);
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

