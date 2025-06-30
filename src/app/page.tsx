import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]/route';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Redirect based on user role
  switch (session.user.role) {
    case 'admin':
      redirect('/dashboard/admin');
    case 'faculty':
      redirect('/dashboard/faculty');
    case 'student':
      redirect('/dashboard/student');
    default:
      redirect('/login');
  }
}