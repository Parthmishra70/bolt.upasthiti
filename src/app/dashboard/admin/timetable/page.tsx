import React from "react";

const AdminTimetablePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Timetable Management</h1>
      <div className="bg-[#23234b] rounded-lg shadow-lg p-6">
        <p className="mb-4">This is the Timetable management page. Here you can view, create, and manage timetables for all departments and classes.</p>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#1a1a2e] rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-[#23234b]">Day</th>
                <th className="py-2 px-4 border-b border-[#23234b]">Time</th>
                <th className="py-2 px-4 border-b border-[#23234b]">Subject</th>
                <th className="py-2 px-4 border-b border-[#23234b]">Faculty</th>
                <th className="py-2 px-4 border-b border-[#23234b]">Room</th>
                <th className="py-2 px-4 border-b border-[#23234b]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Placeholder rows */}
              <tr>
                <td className="py-2 px-4 border-b border-[#23234b]">Monday</td>
                <td className="py-2 px-4 border-b border-[#23234b]">09:00 - 10:00</td>
                <td className="py-2 px-4 border-b border-[#23234b]">Mathematics</td>
                <td className="py-2 px-4 border-b border-[#23234b]">Dr. Smith</td>
                <td className="py-2 px-4 border-b border-[#23234b]">A101</td>
                <td className="py-2 px-4 border-b border-[#23234b]">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded mr-2">Edit</button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">Delete</button>
                </td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTimetablePage;