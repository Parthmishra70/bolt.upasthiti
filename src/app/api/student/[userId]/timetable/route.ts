import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import { getUpcomingClasses } from '@/lib/timetable';

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'student') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get upcoming classes for today
    const upcomingClasses = await getUpcomingClasses(params.userId);

    // Format the response
    const formattedClasses = upcomingClasses.map(cls => ({
      id: cls._id,
      subject: {
        id: cls.subjectId._id,
        name: cls.subjectId.name,
        code: cls.subjectId.code
      },
      faculty: {
        id: cls.facultyId._id,
        username: cls.facultyId.username
      },
      startTime: cls.startTime,
      endTime: cls.endTime,
      room: cls.room
    }));

    return NextResponse.json({
      today: formattedClasses.length,
      upcoming: formattedClasses
    });
  } catch (error) {
    console.error('Error fetching student timetable:', error);
    return NextResponse.json(
      { message: 'Error fetching timetable' },
      { status: 500 }
    );
  }
}