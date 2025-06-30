import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDB } from '@/lib/db';
import User from '@/models/User';

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDB();

    const { username, email } = await req.json();
    const userId = session.user.id;

    const updateData: any = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Profile updated successfully', user });
  } catch (error: any) {
    console.error('Update profile error:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'Username or email already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}