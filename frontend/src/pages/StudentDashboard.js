import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const storedStudent = JSON.parse(localStorage.getItem("student"));

    if (!storedStudent || !storedStudent.student_id) {
      alert("Please login first");
      navigate("/student-login", { replace: true }); // redirect directly to login
      return;
    }

    setStudent(storedStudent);
  }, [navigate]);

  const handleCourseClick = (course) => {
    navigate("/course-attendance", { state: { course, student } });
  };

  const handleLogout = () => {
    localStorage.removeItem("student");
    navigate("/student-login", { replace: true }); // direct logout to login page
  };

  const goBack = () => {
    navigate(-1); // go one step back
  };

  const goHome = () => navigate("/"); // optional home button

  if (!student) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;
  }

  return (
    <div style={{ display: "flex", fontFamily: "'Segoe UI', Tahoma" }}>
      {/* Sidebar */}
      <div style={sidebar}>
        {/* Home Button */}
        <div onClick={goHome} style={sidebarBtn}>
          🏠
          <span style={{ fontSize: "12px" }}>Home</span>
        </div>

        {/* Logout Button */}
        <div onClick={handleLogout} style={sidebarBtn}>
          ⎋
          <span style={{ fontSize: "12px" }}>Logout</span>
        </div>
      </div>

      {/* Main Content */}
      <div style={main}>
        {/* Back Arrow */}
        <div style={backArrow} onClick={goBack}>
          ←
        </div>

        {/* Student Info */}
        <div style={studentCard}>
          <h1 style={studentName}>{student.name}</h1>
          <p style={studentId}>ID: {student.student_id}</p>
        </div>

        {/* Courses */}
        <div style={coursesWrapper}>
          {student.courses.map((course) => (
            <button
              key={course.id}
              style={{
                ...courseBtn,
                transform: hovered === course.id ? "scale(1.07)" : "scale(1)",
                background:
                  hovered === course.id
                    ? "linear-gradient(135deg,#43cea2,#185a9d)"
                    : "linear-gradient(135deg,#2196F3,#21CBF3)",
              }}
              onMouseEnter={() => setHovered(course.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleCourseClick(course)}
            >
              📘 {course.course_name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ---------------- STYLES ---------------- */
const sidebar = {
  width: "80px",
  minHeight: "100vh",
  backgroundColor: "#1a237e",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingTop: "20px",
  gap: "20px",
};

const sidebarBtn = {
  color: "white",
  fontSize: "30px",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const main = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingTop: "40px",
  position: "relative",
};

const backArrow = {
  position: "absolute",
  top: "10px",
  left: "10px",
  fontSize: "32px", // increased size
  fontWeight: "bold",
  cursor: "pointer",
  color: "#1a237e",
};

const studentCard = {
  textAlign: "center",
  marginBottom: "40px",
};

const studentName = {
  fontSize: "48px",
  fontWeight: "bold",
  color: "#1a237e",
  marginBottom: "10px",
};

const studentId = {
  fontSize: "22px",
  fontWeight: "600",
  color: "#555",
};

const coursesWrapper = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "20px",
};

const courseBtn = {
  padding: "18px 36px",
  fontSize: "18px",
  borderRadius: "12px",
  border: "none",
  color: "white",
  cursor: "pointer",
  boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
  transition: "all 0.25s ease",
  width: "250px",
  textAlign: "center",
};

export default StudentDashboard;
