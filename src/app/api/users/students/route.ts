import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDB } from '@/lib/db';
import User from '@/models/User';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const department = searchParams.get('department');
    const division = searchParams.get('division');
    const semester = searchParams.get('semester');

    const filter: any = { role: 'student' };
    if (department) filter.department = department;
    if (division) filter.division = division;
    if (semester) filter.semester = semester;

    const students = await User.find(filter)
      .select('-password')
      .sort({ enrollmentNumber: 1 });

    return NextResponse.json({ students });
  } catch (error) {
    console.error('Get students error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}