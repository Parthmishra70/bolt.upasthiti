import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Subject from '@/models/Subject';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get counts for different user types and subjects
    const [totalUsers, totalStudents, totalFaculty, totalSubjects] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'faculty' }),
      Subject.countDocuments()
    ]);

    // Get department-wise distribution
    const departmentStats = await User.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      }
    ]);

    return NextResponse.json({
      users: { total: totalUsers },
      students: { total: totalStudents },
      faculty: { total: totalFaculty },
      subjects: { total: totalSubjects },
      departments: departmentStats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { message: 'Error fetching statistics' },
      { status: 500 }
    );
  }
}