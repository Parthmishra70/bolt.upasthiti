import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import AttendanceSession from '@/models/AttendanceSession';
import Subject from '@/models/Subject';
import Timetable from '@/models/Timetable';

// Create a new attendance session
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'faculty') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { subjectId, date, startTime, endTime, room, type, verificationMethod } = body;

    await connectDB();

    // Verify the subject belongs to the faculty
    const subject = await Subject.findOne({
      _id: subjectId,
      facultyId: session.user.id
    });

    if (!subject) {
      return NextResponse.json(
        { message: 'Subject not found or unauthorized' },
        { status: 404 }
      );
    }

    // Get total students from timetable
    const timetable = await Timetable.findOne({
      subjectId,
      facultyId: session.user.id
    });

    const totalStudents = timetable?.students?.length || 0;

    // Create attendance session
    const attendanceSession = await AttendanceSession.create({
      subjectId,
      facultyId: session.user.id,
      date,
      startTime,
      endTime,
      room,
      type,
      verificationMethod,
      totalStudents,
      status: 'scheduled'
    });

    return NextResponse.json(attendanceSession, { status: 201 });
  } catch (error) {
    console.error('Error creating attendance session:', error);
    return NextResponse.json(
      { message: 'Error creating attendance session' },
      { status: 500 }
    );
  }
}

// Get attendance sessions for faculty
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['faculty', 'admin'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const status = searchParams.get('status');
    const subjectId = searchParams.get('subjectId');

    const query: any = {};

    if (session.user.role === 'faculty') {
      query.facultyId = session.user.id;
    }
    if (date) query.date = new Date(date);
    if (status) query.status = status;
    if (subjectId) query.subjectId = subjectId;

    const attendanceSessions = await AttendanceSession.find(query)
      .populate('subjectId', 'name code')
      .sort({ date: -1, startTime: -1 })
      .lean();

    return NextResponse.json(attendanceSessions);
  } catch (error) {
    console.error('Error fetching attendance sessions:', error);
    return NextResponse.json(
      { message: 'Error fetching attendance sessions' },
      { status: 500 }
    );
  }
}