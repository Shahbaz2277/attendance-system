import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addEnrollStudent, getStudentsInCourse } from "../api";

export default function StudentAdd() {
  const location = useLocation();
  const navigate = useNavigate();
  const { course_id, course_name, prof_id, batch_id } = location.state || {};

  const [students, setStudents] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);

  // Sidebar professor info
  const [professor, setProfessor] = useState({
    prof_id: prof_id || localStorage.getItem("prof_id") || "",
    name: localStorage.getItem("prof_name") || "",
  });

  const fetchStudents = useCallback(async () => {
    if (!course_id) return;
    try {
      const res = await getStudentsInCourse(course_id);
      setStudents(res);
    } catch (error) {
      console.error("Error fetching students:", error);
      alert("Failed to fetch students. Try again.");
    }
  }, [course_id]);

  useEffect(() => {
    if (!professor.prof_id) {
      navigate("/professor");
      return;
    }
    fetchStudents();
  }, [professor, fetchStudents, navigate]);

  // ---------------- Add Student ----------------
  const handleAddStudent = async () => {
    if (!studentId || !studentName) {
      alert("Please enter both Student ID and Name.");
      return;
    }

    setLoading(true);
    try {
      await addEnrollStudent({
        student_id: studentId,
        name: studentName,
        password: "123", // default password
        course_id,
        batch_id,
      });

      setStudentId("");
      setStudentName("");
      fetchStudents();
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Failed to add student. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Delete Student ----------------
  const handleDeleteStudent = async (student_id) => {
    const confirmDel = window.confirm("Are you sure you want to delete this student?");
    if (!confirmDel) return;

    setLoading(true);
    try {
      await fetch(
        `http://127.0.0.1:8000/student/delete?student_id=${student_id}&course_id=${course_id}`,
        { method: "DELETE" }
      );
      // Update local state after successful deletion
      setStudents(students.filter((s) => s.student_id !== student_id));
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete student. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Navigation ----------------
  const goToAttendance = () => {
    navigate("/attendance", { state: { course_id, course_name, prof_id, batch_id } });
  };

  const handleLogout = () => {
    localStorage.removeItem("prof_id");
    localStorage.removeItem("prof_name");
    navigate("/professor");
  };

  const handleHome = () => {
    navigate("/");
  };

  // ---------------- Render ----------------
  return (
    <div style={{ display: "flex", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "80px",
          minHeight: "100vh",
          backgroundColor: "#1a237e",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "20px",
          gap: "30px",
        }}
      >
        <div onClick={handleHome} style={iconButtonStyle} title="Home">
          🏠
          <span style={iconTextStyle}>Home</span>
        </div>
        <div onClick={handleLogout} style={iconButtonStyle} title="Logout">
          ⎋
          <span style={iconTextStyle}>Logout</span>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, marginTop: "40px", padding: "0 30px", position: "relative" }}>
        <div
          onClick={() => navigate(-1)}
          style={{
            position: "absolute",
            left: "0",
            top: "0",
            fontSize: "32px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          title="Back"
        >
          ←
        </div>

        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>{course_name}</h2>

        {/* Add Student Section */}
        <div style={sectionStyle}>
          <h3>Add Student</h3>
          <input
            style={inputStyle}
            placeholder="Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            disabled={loading}
          />
          <input
            style={inputStyle}
            placeholder="Student Name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            disabled={loading}
          />
          <button style={addButtonStyle} onClick={handleAddStudent} disabled={loading}>
            {loading ? "Processing..." : "Add Student"}
          </button>
        </div>

        {/* Existing Students */}
        <div style={sectionStyle}>
          <h3>Students List</h3>
          {students.length === 0 && <p>No students added yet.</p>}
          {students.map((s) => (
            <div key={s.student_id} style={studentCardStyle}>
              <span>{s.student_id} - {s.name}</span>
              <button style={delButtonStyle} onClick={() => handleDeleteStudent(s.student_id)}>
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Navigate to Attendance */}
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button style={attendanceButtonStyle} onClick={goToAttendance}>
            Mark Attendance
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------- Styles ----------------
const sectionStyle = {
  border: "1px solid #ddd",
  padding: "20px",
  borderRadius: "10px",
  marginBottom: "30px",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
};

const inputStyle = {
  padding: "10px",
  fontSize: "16px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  width: "40%",
  marginRight: "10px",
  marginBottom: "10px",
};

const addButtonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  borderRadius: "5px",
  border: "none",
  backgroundColor: "#4CAF50",
  color: "white",
  cursor: "pointer",
};

const studentCardStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "5px",
  backgroundColor: "#f9f9f9",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
};

const delButtonStyle = {
  padding: "6px 12px",
  fontSize: "14px",
  borderRadius: "5px",
  border: "none",
  backgroundColor: "#f44336",
  color: "white",
  cursor: "pointer",
};

const attendanceButtonStyle = {
  padding: "12px 30px",
  fontSize: "16px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#2196F3",
  color: "white",
  cursor: "pointer",
};

const iconButtonStyle = {
  color: "white",
  fontSize: "32px",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const iconTextStyle = {
  fontSize: "12px",
  marginTop: "4px",
};
