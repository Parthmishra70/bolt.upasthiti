import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Protect dashboard routes based on user role
    if (path.startsWith('/dashboard/')) {
      const role = path.split('/')[2]; // admin, faculty, or student
      if (token?.role !== role) {
        return NextResponse.redirect(new URL(`/dashboard/${token?.role}`, req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/admin/:path*',
    '/api/faculty/:path*',
    '/api/student/:path*'
  ]
};