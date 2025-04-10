'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const TeacherDashboard = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-center text-red-500 text-lg">No user data found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center justify-start">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-2">Welcome, {user.name} 👩‍🏫</h1>
        <p className="text-gray-600 mb-6">Email: {user.email}</p>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Teaching Schedule:</h2>
        {user.teaches.map((entry: any, idx: number) => (
          <div
            key={idx}
            className="mb-4 bg-blue-50 border border-blue-200 p-4 rounded-lg"
          >
            <p className="font-medium text-gray-700">
              <span className="text-gray-600">Class:</span> {entry.class}
            </p>
            <p className="text-gray-700">
              <span className="text-gray-600">Subjects:</span> {entry.subjects.join(', ')}
            </p>
          </div>
        ))}

        <div className="mt-6">
          <Link href="/dashboard/teacher/addMarks">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200">
              ➕ Add Marks
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
