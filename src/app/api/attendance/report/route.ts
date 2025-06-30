import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import Attendance from '@/models/Attendance';
import User from '@/models/User';
import Subject from '@/models/Subject';

// Get attendance report (Faculty/Admin)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['faculty', 'admin'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get('subjectId');
    const division = searchParams.get('division');
    const department = searchParams.get('department');
    const semester = searchParams.get('semester');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const facultyId = searchParams.get('facultyId');
    const filter: any = {};
    if (subjectId) filter.subjectId = subjectId;
    if (division) filter.division = division;
    if (department) filter.department = department;
    if (semester) filter.semester = semester;
    if (facultyId) filter.facultyId = facultyId;
    if (session.user.role === 'faculty') {
      filter.facultyId = session.user.id;
    }
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    const attendance = await Attendance.find(filter)
      .populate('studentId', 'username email')
      .populate('subjectId', 'name code')
      .populate('facultyId', 'username email')
      .sort({ date: -1, studentName: 1 });
    return NextResponse.json({ attendance });
  } catch (error) {
    console.error('Get attendance report error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}