import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Users, GraduationCap, UserCog, BookOpen } from 'lucide-react';
import React from 'react';

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
      color: 'from-blue-500 to-blue-700',
      iconBg: 'bg-blue-600'
    },
    {
      title: 'Students',
      value: stats.students.total,
      icon: GraduationCap,
      color: 'from-green-500 to-green-700',
      iconBg: 'bg-green-600'
    },
    {
      title: 'Faculty',
      value: stats.faculty.total,
      icon: UserCog,
      color: 'from-purple-500 to-purple-700',
      iconBg: 'bg-purple-600'
    },
    {
      title: 'Subjects',
      value: stats.subjects.total,
      icon: BookOpen,
      color: 'from-yellow-500 to-yellow-700',
      iconBg: 'bg-yellow-600'
    }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-8 text-white">
      <h2 className="text-3xl font-extrabold mb-8 text-center">Admin Dashboard</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`rounded-2xl shadow-lg bg-gradient-to-br ${card.color} p-6 flex flex-col items-center justify-center relative overflow-hidden`}
          >
            <div className={`absolute top-4 left-4 rounded-full ${card.iconBg} p-3 shadow-lg`}>
              <card.icon className="h-7 w-7 text-white" aria-hidden="true" />
            </div>
            <div className="mt-10 text-center">
              <p className="text-lg font-semibold text-white/80">{card.title}</p>
              <p className="text-3xl font-bold mt-2 text-white">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-[#23234b] shadow-lg p-8">
          <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <a href="/dashboard/admin/users" className="flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-3 text-base font-semibold text-white shadow transition">Manage Users</a>
            <a href="/dashboard/admin/subjects" className="flex items-center justify-center rounded-lg bg-green-600 hover:bg-green-700 px-4 py-3 text-base font-semibold text-white shadow transition">Manage Subjects</a>
            <a href="/dashboard/admin/departments" className="flex items-center justify-center rounded-lg bg-purple-600 hover:bg-purple-700 px-4 py-3 text-base font-semibold text-white shadow transition">Manage Departments</a>
            <a href="/dashboard/admin/timetable" className="flex items-center justify-center rounded-lg bg-yellow-600 hover:bg-yellow-700 px-4 py-3 text-base font-semibold text-white shadow transition">Manage Timetable</a>
          </div>
        </div>
        <div className="rounded-2xl bg-[#23234b] shadow-lg p-8">
          <h3 className="text-xl font-bold mb-6">System Status</h3>
          <dl className="space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-base font-medium text-gray-300">Database Status</dt>
              <dd className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-green-400 mr-2"></div>
                <span className="text-base text-white">Connected</span>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-base font-medium text-gray-300">Last Backup</dt>
              <dd className="text-base text-white">Today, 03:00 AM</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-base font-medium text-gray-300">System Version</dt>
              <dd className="text-base text-white">1.0.0</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}