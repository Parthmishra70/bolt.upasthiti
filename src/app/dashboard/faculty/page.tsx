import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { BookOpen, Users, Clock, CalendarCheck } from 'lucide-react';

async function getFacultyStats(userId: string) {
  try {
    const [subjectsRes, studentsRes, attendanceRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faculty/${userId}/subjects`, { cache: 'no-store' }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faculty/${userId}/students`, { cache: 'no-store' }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faculty/${userId}/attendance`, { cache: 'no-store' })
    ]);

    const [subjects, students, attendance] = await Promise.all([
      subjectsRes.json(),
      studentsRes.json(),
      attendanceRes.json()
    ]);

    return { subjects, students, attendance };
  } catch (error) {
    console.error('Error fetching faculty stats:', error);
    return {
      subjects: { total: 0, list: [] },
      students: { total: 0 },
      attendance: { total: 0, recent: [] }
    };
  }
}

export default async function FacultyDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'faculty') {
    redirect('/login');
  }

  const stats = await getFacultyStats(session.user.id);

  const cards = [
    {
      title: 'Assigned Subjects',
      value: stats.subjects.total,
      icon: BookOpen,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Students',
      value: stats.students.total,
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Classes Today',
      value: stats.subjects.list?.filter(s => s.hasClassToday).length || 0,
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Attendance Sessions',
      value: stats.attendance.total,
      icon: CalendarCheck,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Faculty Dashboard
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
            <h3 className="text-base font-semibold leading-6 text-gray-900">My Subjects</h3>
            <div className="mt-6 flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {stats.subjects.list?.map((subject) => (
                  <li key={subject.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <BookOpen className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {subject.name}
                        </p>
                        <p className="truncate text-sm text-gray-500">
                          {subject.code} • Semester {subject.semester}
                        </p>
                      </div>
                      <div>
                        <a
                          href={`/dashboard/faculty/subjects/${subject.id}`}
                          className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">Recent Attendance Sessions</h3>
            <div className="mt-6 flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {stats.attendance.recent?.map((session) => (
                  <li key={session.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <CalendarCheck className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {session.subject.name}
                        </p>
                        <p className="truncate text-sm text-gray-500">
                          {new Date(session.date).toLocaleDateString()} • {session.attendanceCount} present
                        </p>
                      </div>
                      <div>
                        <a
                          href={`/dashboard/faculty/attendance/${session.id}`}
                          className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          Details
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}