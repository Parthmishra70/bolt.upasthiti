import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Users, GraduationCap, UserCog, BookOpen } from 'lucide-react';

async function getStats() {
  try {
    const res = await fetch("/api/admin/stats", { cache: 'no-store' });
    const data = await res.json();
    return {
      users: { total: data.users?.total || 0 },
      students: { total: data.students?.total || 0 },
      faculty: { total: data.faculty?.total || 0 },
      subjects: { total: data.subjects?.total || 0 }
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      users: { total: 0 },
      students: { total: 0 },
      faculty: { total: 0 },
      subjects: { total: 0 }
    };
  }
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    redirect('/login');
  }

  const stats = await getStats();

  const cards = [
    {
      title: 'Total Users',
      value: stats.users.total,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Students',
      value: stats.students.total,
      icon: GraduationCap,
      color: 'bg-green-500'
    },
    {
      title: 'Faculty',
      value: stats.faculty.total,
      icon: UserCog,
      color: 'bg-purple-500'
    },
    {
      title: 'Subjects',
      value: stats.subjects.total,
      icon: BookOpen,
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Admin Dashboard
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className={`absolute rounded-md ${card.color} p-3`}>
                <card.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{card.title}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
            </dd>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">Quick Actions</h3>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <a
                href="/dashboard/admin/users"
                className="flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Manage Users
              </a>
              <a
                href="/dashboard/admin/subjects"
                className="flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Manage Subjects
              </a>
              <a
                href="/dashboard/admin/departments"
                className="flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Manage Departments
              </a>
              <a
                href="/dashboard/admin/timetable"
                className="flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Manage Timetable
              </a>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">System Status</h3>
            <dl className="mt-6 grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm font-medium text-gray-500">Database Status</dt>
                <dd className="flex items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"></div>
                  <span className="text-sm text-gray-900">Connected</span>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm font-medium text-gray-500">Last Backup</dt>
                <dd className="text-sm text-gray-900">Today, 03:00 AM</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm font-medium text-gray-500">System Version</dt>
                <dd className="text-sm text-gray-900">1.0.0</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}