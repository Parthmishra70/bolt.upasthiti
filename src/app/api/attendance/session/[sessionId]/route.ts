import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import AttendanceSession from '@/models/AttendanceSession';
import Attendance from '@/models/Attendance';

// End an attendance session (Faculty only)
export async function PATCH(req: Request, { params }: { params: { sessionId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'faculty') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const { sessionId } = params;
    const attendanceSession = await AttendanceSession.findOne({ sessionId, facultyId: session.user.id, status: 'active' });
    if (!attendanceSession) {
      return NextResponse.json({ message: 'Active session not found' }, { status: 404 });
    }
    // Count present students
    const presentCount = await Attendance.countDocuments({ sessionId, status: 'present' });
    const absentCount = attendanceSession.totalStudents - presentCount;
    attendanceSession.endTime = new Date();
    attendanceSession.presentStudents = presentCount;
    attendanceSession.absentStudents = absentCount;
    attendanceSession.status = 'completed';
    await attendanceSession.save();
    return NextResponse.json({ message: 'Attendance session ended successfully', session: attendanceSession });
  } catch (error) {
    console.error('End attendance session error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}