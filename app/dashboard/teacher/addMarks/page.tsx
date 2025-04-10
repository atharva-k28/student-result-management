'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AddMarks = () => {
  const [user, setUser] = useState<any>(null);
  const [cls, setCls] = useState('');
  const [sub, setSub] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [marks, setMarks] = useState<{ [key: string]: string }>({});

  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      const res = await fetch('/api/students');
      const data = await res.json();
      setStudents(data);
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    if (cls && students.length) {
      const matched = students.filter((s: any) => s.class === cls);
      setFilteredStudents(matched);
    }
  }, [cls, students]);

  const handleSubmit = async () => {
    const result = filteredStudents.map((student) => ({
      studentEmail: student.email,
      studentName: student.name,
      class: cls,
      subject: sub,
      subjectCode: mapSubjectToCode(sub), // optional
      marksObtained: parseInt(marks[student.email] || '0'),
      maxMarks: 50,
      teacherEmail: user.email,
      gradePoint: calcGradePoint(parseInt(marks[student.email] || '0')),
      createdAt: new Date().toISOString(),
    }));

    const res = await fetch('/api/marks', {
      method: 'POST',
      body: JSON.stringify(result),
    });

    if (res.ok) {
      alert('Marks submitted successfully ✅');
      router.push('/dashboard/teacher');
    } else {
      alert('Error submitting marks.');
    }
  };

  const mapSubjectToCode = (subject: string) => {
    const subjectMap: Record<string, string> = {
      Maths: 'MATH101',
      Physics: 'PHY101',
      Chemistry: 'CHEM101',
    };
    return subjectMap[subject] || subject;
  };

  const calcGradePoint = (marks: number) => {
    const percent = (marks / 50) * 100;
    if (percent >= 90) return 10;
    if (percent >= 80) return 9;
    if (percent >= 70) return 8;
    if (percent >= 60) return 7;
    if (percent >= 50) return 6;
    return 5;
  };

  if (!user) {
    return <p className="text-center text-red-500 mt-10">No user data found</p>;
  }

  const classOptions = user.teaches.map((entry: any) => entry.class);
  const subjectOptions =
    user.teaches.find((entry: any) => entry.class === cls)?.subjects || [];

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">Add Marks</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 mb-1">Select Class</label>
            <select
              value={cls}
              onChange={(e) => setCls(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-gray-600"
            >
              <option value="">-- Select Class --</option>
              {classOptions.map((clsOpt: string, idx: number) => (
                <option key={idx} value={clsOpt}>
                  {clsOpt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Select Subject</label>
            <select
              value={sub}
              onChange={(e) => setSub(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-gray-600"
              disabled={!cls}
            >
              <option value="">-- Select Subject --</option>
              {subjectOptions.map((subOpt: string, idx: number) => (
                <option key={idx} value={subOpt}>
                  {subOpt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {cls && sub && (
          <>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Enter Marks for Students
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredStudents.map((student, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between border border-gray-200 p-3 rounded-md bg-gray-50"
                  >
                    <span className="text-gray-700 font-medium">
                      {student.name}
                    </span>
                    <input
                      type="number"
                      value={marks[student.email] || ''}
                      onChange={(e) =>
                        setMarks({ ...marks, [student.email]: e.target.value })
                      }
                      placeholder="Enter marks"
                      className="w-24 border border-gray-300 rounded-md p-1 text-gray-600"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
            >
              Submit All Marks
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AddMarks;
