import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDB } from '@/lib/db';
import User from '@/models/User';

export async function PUT(req: Request, { params }: { params: { userId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDB();

    const { userId } = params;
    const { subjectIds } = await req.json();

    const user = await User.findById(userId);
    if (!user || user.role !== 'faculty') {
      return NextResponse.json({ message: 'Faculty member not found' }, { status: 404 });
    }

    user.assignedSubjects = subjectIds;
    await user.save();

    const updatedUser = await User.findById(userId)
      .populate('assignedSubjects')
      .select('-password');

    return NextResponse.json({
      message: 'Subjects assigned successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Assign subjects error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}