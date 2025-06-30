import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import Subject from '@/models/Subject';
import { getTodayClasses } from '@/lib/timetable';

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'faculty') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get all subjects assigned to the faculty
    const subjects = await Subject.find({ facultyId: params.userId })
      .select('name code department semester credits description')
      .lean();

    // Get today's classes for these subjects
    const todayClasses = await getTodayClasses(params.userId);
    
    // Add hasClassToday flag to each subject
    const subjectsWithClassInfo = subjects.map(subject => ({
      ...subject,
      hasClassToday: todayClasses.some(cls => cls.subjectId.toString() === subject._id.toString())
    }));

    return NextResponse.json({
      total: subjects.length,
      list: subjectsWithClassInfo
    });
  } catch (error) {
    console.error('Error fetching faculty subjects:', error);
    return NextResponse.json(
      { message: 'Error fetching subjects' },
      { status: 500 }
    );
  }
}