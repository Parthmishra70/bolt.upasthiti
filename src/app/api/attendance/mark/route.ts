import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import Attendance from '@/models/Attendance';
import AttendanceSession from '@/models/AttendanceSession';
import { updateAttendanceStats } from '@/lib/attendance';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['faculty', 'admin'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { sessionId, studentId, status, verificationMethod, location, notes } = body;

    await connectDB();

    // Verify the attendance session exists and is active
    const attendanceSession = await AttendanceSession.findById(sessionId);
    if (!attendanceSession) {
      return NextResponse.json(
        { message: 'Attendance session not found' },
        { status: 404 }
      );
    }

    if (attendanceSession.status !== 'active') {
      return NextResponse.json(
        { message: 'Attendance session is not active' },
        { status: 400 }
      );
    }

    // Create or update attendance record
    const attendance = await Attendance.findOneAndUpdate(
      { sessionId, studentId },
      {
        status,
        verificationMethod,
        location,
        notes,
        verifiedAt: new Date()
      },
      { upsert: true, new: true }
    );

    // Update attendance statistics
    await updateAttendanceStats(sessionId);

    return NextResponse.json(attendance, { status: 200 });
  } catch (error) {
    console.error('Error marking attendance:', error);
    return NextResponse.json(
      { message: 'Error marking attendance' },
      { status: 500 }
    );
  }
}

// Get attendance records for a session
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');
    const studentId = searchParams.get('studentId');

    if (!sessionId) {
      return NextResponse.json(
        { message: 'Session ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const query: any = { sessionId };
    if (studentId) query.studentId = studentId;

    // For students, only allow viewing their own attendance
    if (session.user.role === 'student') {
      query.studentId = session.user.id;
    }

    const attendanceRecords = await Attendance.find(query)
      .populate('studentId', 'username email')
      .lean();

    return NextResponse.json(attendanceRecords);
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    return NextResponse.json(
      { message: 'Error fetching attendance records' },
      { status: 500 }
    );
  }
}