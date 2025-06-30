import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { BookOpen, Clock, CalendarCheck, GraduationCap } from 'lucide-react';

async function getStudentStats(userId: string) {
  try {
    const [subjectsRes, timetableRes, attendanceRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/${userId}/subjects`, { cache: 'no-store' }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/${userId}/timetable`, { cache: 'no-store' }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/${userId}/attendance`, { cache: 'no-store' })
    ]);

    const [subjects, timetable, attendance] = await Promise.all([
      subjectsRes.json(),
      timetableRes.json(),
      attendanceRes.json()
    ]);

    return { subjects, timetable, attendance };
  } catch (error) {
    console.error('Error fetching student stats:', error);
    return {
      subjects: { total: 0, list: [] },
      timetable: { today: [], upcoming: [] },
      attendance: { overall: 0, subjects: [] }
    };
  }
}

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'student') {
    redirect('/login');
  }

  const stats = await getStudentStats(session.user.id);

  const cards = [
    {
      title: 'Enrolled Subjects',
      value: stats.subjects.total,
      icon: BookOpen,
      color: 'bg-blue-500'
    },
    {
      title: 'Today\'s Classes',
      value: stats.timetable.today.length,
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Overall Attendance',
      value: `${stats.attendance.overall}%`,
      icon: CalendarCheck,
      color: 'bg-green-500'
    },
    {
      title: 'Semester',
      value: session.user.semester || 'N/A',
      icon: GraduationCap,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Student Dashboard
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
            <h3 className="text-base font-semibold leading-6 text-gray-900">Upcoming Classes</h3>
            <div className="mt-6 flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {stats.timetable.upcoming.map((class_) => (
                  <li key={class_.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Clock className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {class_.subject.name}
                        </p>
                        <p className="truncate text-sm text-gray-500">
                          {class_.startTime} - {class_.endTime} • Room {class_.room}
                        </p>
                      </div>
                      <div>
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          {class_.faculty.username}
                        </span>
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
            <h3 className="text-base font-semibold leading-6 text-gray-900">Attendance Overview</h3>
            <div className="mt-6 flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {stats.attendance.subjects.map((subject) => (
                  <li key={subject.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <CalendarCheck className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {subject.name}
                        </p>
                        <div className="mt-1">
                          <div className="flex items-center">
                            <div className="relative flex-grow h-2 rounded-full bg-gray-200">
                              <div
                                className={`absolute h-2 rounded-full ${subject.attendance >= 75 ? 'bg-green-500' : 'bg-yellow-500'}`}
                                style={{ width: `${subject.attendance}%` }}
                              />
                            </div>
                            <span className="ml-2 flex-shrink-0 text-sm text-gray-500">
                              {subject.attendance}%
                            </span>
                          </div>
                        </div>
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