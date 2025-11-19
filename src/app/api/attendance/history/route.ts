import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import AttendanceModel from '@/lib/models/Attendance';
import { requireRole, getCurrentUser } from '@/utils/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const user = getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');

    const query: any = {};

    // Employees can only see their own attendance
    if (user.role === 'employee') {
      query.employeeId = user._id;
    } else if (employeeId) {
      query.employeeId = employeeId;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        query.date.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    if (status) {
      query.status = status;
    }

    const attendance = await AttendanceModel.find(query)
      .sort({ date: -1, checkIn: -1 })
      .limit(100);

    return NextResponse.json(attendance);
  } catch (error: any) {
    console.error('Get attendance history error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

