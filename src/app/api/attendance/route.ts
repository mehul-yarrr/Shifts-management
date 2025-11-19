import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import AttendanceModel from '@/lib/models/Attendance';
import { validateMarkAttendance } from '@/utils/validate';
import { requireRole, getCurrentUser } from '@/utils/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const user = getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const data = validateMarkAttendance(body);

    // Employees can only mark their own attendance
    if (user.role === 'employee' && data.employeeId !== user._id) {
      return NextResponse.json(
        { error: 'You can only mark your own attendance' },
        { status: 403 }
      );
    }

    // Check if attendance already exists for this date
    const existingAttendance = await AttendanceModel.findOne({
      employeeId: data.employeeId,
      date: new Date(data.date),
    });

    if (existingAttendance) {
      // Update existing attendance
      const updateData: any = {
        checkIn: new Date(data.checkIn),
      };
      if (data.checkOut) updateData.checkOut = new Date(data.checkOut);
      if (data.status) updateData.status = data.status;
      if (data.notes) updateData.notes = data.notes;

      const attendance = await AttendanceModel.findByIdAndUpdate(
        existingAttendance._id,
        updateData,
        { new: true }
      );

      return NextResponse.json(attendance);
    }

    // Create new attendance
    const attendance = await AttendanceModel.create({
      ...data,
      date: new Date(data.date),
      checkIn: new Date(data.checkIn),
      checkOut: data.checkOut ? new Date(data.checkOut) : undefined,
    });

    return NextResponse.json(attendance, { status: 201 });
  } catch (error: any) {
    console.error('Mark attendance error:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

