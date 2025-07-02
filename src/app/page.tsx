import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex flex-col items-center justify-center text-white">
      <div className="max-w-2xl w-full px-6 py-12 bg-[#23234b] rounded-2xl shadow-2xl flex flex-col items-center">
        <h1 className="text-4xl font-extrabold mb-4 text-center">Welcome to Smart Campus</h1>
        <p className="mb-8 text-lg text-center text-gray-300">A modern platform for seamless campus management. Sign in to access your personalized dashboard and manage users, subjects, timetables, and more.</p>
        <div className="flex gap-4 mb-8">
          <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition">Sign In</Link>
          <Link href="/about" className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold transition">Learn More</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-6">
          <div className="bg-[#1a1a2e] rounded-lg p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">🎓</span>
            <span className="font-bold">Student Portal</span>
            <span className="text-sm text-gray-400 mt-1 text-center">Track attendance, view timetable, and access resources.</span>
          </div>
          <div className="bg-[#1a1a2e] rounded-lg p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">👨‍🏫</span>
            <span className="font-bold">Faculty Portal</span>
            <span className="text-sm text-gray-400 mt-1 text-center">Manage classes, attendance, and student progress.</span>
          </div>
          <div className="bg-[#1a1a2e] rounded-lg p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">🛠️</span>
            <span className="font-bold">Admin Panel</span>
            <span className="text-sm text-gray-400 mt-1 text-center">Oversee users, subjects, departments, and analytics.</span>
          </div>
        </div>
      </div>
    </main>
  );
}