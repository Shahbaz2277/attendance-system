import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StudentDashboard({ studentId }) {
  const [courses, setCourses] = useState([]);
  const API = "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API}/student/courses/${studentId}`);
        setCourses(res.data.courses || []);
      } catch (err) {
        console.log(err.response?.data?.detail || err.message);
      }
    };
    fetchCourses();
  }, [studentId]);

  return (
    <div>
      <h2>Student Dashboard</h2>
      <h3>Assigned Courses</h3>
      {courses.length === 0 ? (
        <p>No courses assigned yet</p>
      ) : (
        <ul>
          {courses.map((c, i) => (
            <li key={i}>{c.title} - {c.professor} (Batch {c.batch})</li>
          ))}
        </ul>
      )}
    </div>
  );
}
