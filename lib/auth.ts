export const loginUser = async (email: string, password: string) => {
    try {
      const studentRes = await fetch("/api/students", { cache: "no-store" });
      const students = await studentRes.json();
      console.log("Students:", students);
  
      const student = students.find((s: any) => s.email === email && s.password === password);
      if (student) {
        const user = { ...student, role: 'student' };
        localStorage.setItem("user", JSON.stringify(user));
        return user;
      }
  
      const teacherRes = await fetch("/api/teachers", { cache: "no-store" });
      const teachers = await teacherRes.json();
      console.log("Teachers:", teachers);
  
      const teacher = teachers.find((t: any) => t.email === email && t.password === password);
      if (teacher) {
        const user = { ...teacher, role: 'teacher' };
        localStorage.setItem("user", JSON.stringify(user));
        return user;
      }
  
      return null;
    } catch (error) {
      console.error("Login error:", error);
      return null;
    }
  };
  