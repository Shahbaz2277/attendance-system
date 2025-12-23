import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllAttendanceForCourse } from "../api";

const CourseAttendance = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { course, student } = location.state || {};

  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const loadAttendance = async () => {
      if (!course || !student) {
        alert("Invalid access. Redirecting to dashboard.");
        navigate("/student-dashboard");
        return;
      }

      try {
        setLoading(true);
        const data = await getAllAttendanceForCourse(course.id);
        const studentData = data[student.student_id] || {};

        // Convert to array
        let attendanceArray = Object.entries(studentData)
          .map(([date, status]) => ({ date, status }));

        // Sort descending for recent first
        attendanceArray.sort((a, b) => new Date(b.date) - new Date(a.date));

        // First 11 most recent
        const recent = attendanceArray.slice(0, 11);

        // Older dates sorted ascending
        const older = attendanceArray.slice(11).sort((a, b) => new Date(a.date) - new Date(b.date));

        // Combine
        attendanceArray = [...recent, ...older];

        setAttendance(attendanceArray);

        const totalDays = attendanceArray.length;
        const presentDays = attendanceArray.filter(
          (item) => item.status.toLowerCase() === "present"
        ).length;

        setPercentage(totalDays ? Math.round((presentDays / totalDays) * 100) : 0);
      } catch (error) {
        console.error(error);
        alert("Error fetching attendance");
      } finally {
        setLoading(false);
      }
    };

    loadAttendance();
  }, [course, student, navigate]);

  if (loading)
    return <p style={{ textAlign: "center", marginTop: 50 }}>Loading attendance...</p>;
  if (!attendance || attendance.length === 0)
    return <p style={{ textAlign: "center", marginTop: 50 }}>No attendance recorded yet</p>;

  return (
    <div style={container}>
      {/* Header */}
      <div style={header}>
        <h1 style={courseName}>{course.course_name}</h1>
      </div>

      {/* Student Info */}
      <div style={studentInfo}>
        <h2>{student.name}</h2>
        <p>ID: <strong>{student.student_id}</strong></p>
        <div style={percentageBadge}>{percentage}%</div>
      </div>

      {/* Attendance Table */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((item) => (
            <tr key={item.date}>
              <td style={tdStyle}>{item.date}</td>
              <td style={{ ...tdStyle, color: item.status.toLowerCase() === "present" ? "green" : "red" }}>
                {item.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ---------------- Styles ----------------
const container = {
  maxWidth: 900,
  margin: "40px auto",
  fontFamily: "Arial, sans-serif",
  textAlign: "center",
};

const header = {
  padding: "40px 20px",
  background: "linear-gradient(135deg, #2196F3, #21CBF3)",
  borderRadius: 15,
  color: "white",
  marginBottom: 30,
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
};

const courseName = {
  margin: 0,
  fontSize: 36,
  fontWeight: "bold",
};

const studentInfo = {
  marginBottom: 30,
};

const percentageBadge = {
  display: "inline-block",
  marginTop: 10,
  padding: "10px 20px",
  borderRadius: 50,
  backgroundColor: "#FF9800",
  color: "white",
  fontWeight: "bold",
  fontSize: 20,
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const thStyle = {
  border: "1px solid #ccc",
  padding: 12,
  backgroundColor: "#3F51B5",
  color: "white",
  fontSize: 16,
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: 10,
  fontSize: 15,
};

export default CourseAttendance;
