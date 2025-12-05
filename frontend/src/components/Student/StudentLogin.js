import React, { useState, useEffect } from "react";
import { loginStudent, getStudentCourses } from "../../api";

const StudentLogin = () => {
  const [student_id, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [courses, setCourses] = useState([]);

  const handleLogin = async () => {
    if (!student_id || !password) {
      alert("Please fill all fields");
      return;
    }
    try {
      await loginStudent({ student_id, password });
      const data = await getStudentCourses(student_id);
      setCourses(data.courses || []);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", textAlign: "center" }}>
      <h2>Student Login</h2>
      <input
        placeholder="Student ID"
        value={student_id}
        onChange={(e) => setStudentId(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {message && <p>{message}</p>}

      {courses.length > 0 && (
        <div>
          <h3>Your Courses</h3>
          <ul>
            {courses.map((course, index) => (
              <li key={index}>
                {course.title} (Batch {course.batch}) - Professor: {course.professor_name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StudentLogin;
