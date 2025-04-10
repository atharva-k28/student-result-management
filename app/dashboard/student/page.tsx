'use client';
import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const StudentDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [marks, setMarks] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Fetch marks
      fetch('/api/marks', { cache: 'no-store' })
        .then((res) => res.json())
        .then((data) => {
          const filtered = data.filter(
            (m: any) => m.studentEmail === parsedUser.email
          );
          setMarks(filtered);
        });

      // Fetch subjects
      fetch('/api/subjects')
        .then((res) => res.json())
        .then((data) => {
          setSubjects(data);
        });
    }
  }, []);

  const downloadResultPDF = (
    user: any,
    marks: any[],
    subjects: any[]
  ) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('MIT World Peace University', 105, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.text(`Name: ${user.name}`, 14, 40);
    doc.text(`Email: ${user.email}`, 14, 50);
    doc.text(`Class: ${user.class}`, 14, 60);

    const tableData: any[] = [];
    let totalWeighted = 0;
    let totalCredits = 0;

    marks.forEach((m: any) => {
      const subjectMeta = subjects.find(
        (s: any) =>
          s.name.toLowerCase() === m.subject.toLowerCase()
      );

      const credit = subjectMeta?.gradePoints || 0;
      const percent = (m.marksObtained / 100) * 100;
      const grade =
        percent >= 90
          ? 10
          : percent >= 80
          ? 9
          : percent >= 70
          ? 8
          : percent >= 60
          ? 7
          : percent >= 50
          ? 6
          : 5;

      totalWeighted += grade * credit;
      totalCredits += credit;

      tableData.push([
        m.subject,
        m.marksObtained,
        credit,
        grade
      ]);
    });

    const cgpa = totalCredits
      ? (totalWeighted / totalCredits).toFixed(2)
      : 'N/A';

    autoTable(doc, {
      head: [['Subject', 'Marks', 'Credit', 'Grade Point']],
      body: tableData,
      startY: 70,
      styles: { halign: 'center' },
    });

    doc.setFontSize(14);
    doc.text(`CGPA: ${cgpa}`, 14, (doc as any).lastAutoTable.finalY + 15);

    doc.save(`Result_${user.name}.pdf`);
  };

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
        <h1 className="text-2xl font-bold text-blue-600 mb-2">
          Welcome, {user.name} 👋
        </h1>
        <p className="text-gray-600 mb-6">Class: {user.class}</p>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Subjects:</h2>
        <ul className="list-disc list-inside text-gray-700 mb-6">
          {user.subjects.map((subject: string) => (
            <li key={subject}>{subject}</li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Marks:</h2>
        {marks.length > 0 ? (
          <div className="space-y-3">
            {marks.map((mark, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-blue-50 border border-blue-200 p-3 rounded-lg"
              >
                <span className="font-medium text-gray-700">
                  {mark.subject}
                </span>
                <span className="font-semibold text-blue-700">
                  {mark.marksObtained}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No marks available yet.</p>
        )}

        {marks.length > 0 && (
         <button
         onClick={() => downloadResultPDF(user, marks, subjects)}
         className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition"
       >
         Download Result PDF
       </button>
       
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
