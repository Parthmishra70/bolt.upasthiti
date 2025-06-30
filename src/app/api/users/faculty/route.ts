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

    const filter: any = { role: 'faculty' };
    if (department) filter.department = department;

    const faculty = await User.find(filter)
      .select('-password')
      .populate('assignedSubjects')
      .sort({ employeeId: 1 });

    return NextResponse.json({ faculty });
  } catch (error) {
    console.error('Get faculty error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}