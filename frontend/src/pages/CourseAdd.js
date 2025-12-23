import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addCourse, getCoursesByBatch, deleteCourse } from "../api";

export default function CourseAdd() {
  const location = useLocation();
  const navigate = useNavigate();
  const { prof_id, batch_id } = location.state || {};

  const [courseName, setCourseName] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  // ---------------- Fetch courses ----------------
  const fetchCourses = async () => {
    if (!batch_id || !prof_id) return;
    try {
      const res = await getCoursesByBatch(batch_id, prof_id);
      setCourses(res || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [batch_id, prof_id]);

  // ---------------- Navigation ----------------
  const goToHome = () => {
    navigate("/", { replace: true }); // Home.js (Professor / Student)
  };

  const handleLogout = () => {
    localStorage.removeItem("prof_id");
    navigate("/professor", { replace: true });
  };

  // ---------------- Add course ----------------
  const handleAddCourse = async () => {
    if (!courseName) return;
    setLoading(true);
    try {
      await addCourse({ course_name: courseName, batch_id, prof_id });
      setCourseName("");
      fetchCourses();
    } catch (err) {
      console.error("Failed to add course:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleAddCourse();
  };

  const handleManageStudents = (course_id, course_name) => {
    navigate("/student", {
      state: { prof_id, batch_id, course_id, course_name },
    });
  };

  const handleDeleteCourse = async (course_id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await deleteCourse(course_id);
      fetchCourses();
    } catch (err) {
      console.error("Failed to delete course:", err);
    }
  };

  return (
    <div style={{ display: "flex", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      {/* -------- Sidebar -------- */}
      <div style={sidebarStyle}>
        <div onClick={goToHome} style={sidebarIconStyle} title="Home">
          🏠
          <span style={sidebarLabelStyle}>Home</span>
        </div>

        <div onClick={handleLogout} style={sidebarIconStyle} title="Logout">
          ⎋
          <span style={sidebarLabelStyle}>Logout</span>
        </div>
      </div>

      {/* -------- Main Content -------- */}
      <div style={containerStyle}>
        {/* Back Arrow */}
        <button onClick={goToHome} style={backButtonStyle} title="Back">
          ←
        </button>

        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
          Batch {batch_id} – Courses
        </h2>

        {/* Add Course */}
        <div style={sectionStyle}>
          <input
            style={inputStyle}
            placeholder="Course Name"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button style={buttonStyle} onClick={handleAddCourse} disabled={loading}>
            {loading ? "Adding..." : "Add Course"}
          </button>
        </div>

        {/* Course List */}
        <div style={sectionStyle}>
          {courses.length === 0 && <p>No courses added yet.</p>}

          {courses.map((course) => (
            <div key={course.id} style={courseCardStyle}>
              <span>{course.course_name}</span>
              <div>
                <button
                  style={manageButtonStyle}
                  onClick={() => handleManageStudents(course.id, course.course_name)}
                >
                  Manage Students
                </button>
                <button
                  style={delButtonStyle}
                  onClick={() => handleDeleteCourse(course.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Styles ---------- */

const sidebarStyle = {
  width: "80px",
  minHeight: "100vh",
  backgroundColor: "#1a237e",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingTop: "20px",
  gap: "30px",
};

const sidebarIconStyle = {
  color: "white",
  fontSize: "32px",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const sidebarLabelStyle = {
  fontSize: "12px",
  marginTop: "4px",
};

const containerStyle = {
  flex: 1,
  marginLeft: "80px",
  padding: "40px",
  position: "relative",
};

const backButtonStyle = {
  position: "absolute",
  top: "20px",
  left: "20px",
  fontSize: "28px",
  fontWeight: "bold",
  background: "none",
  border: "none",
  cursor: "pointer",
};

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
  width: "70%",
  marginRight: "10px",
};

const buttonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  borderRadius: "5px",
  border: "none",
  backgroundColor: "#4CAF50",
  color: "white",
  cursor: "pointer",
};

const courseCardStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "5px",
  backgroundColor: "#f9f9f9",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
};

const manageButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#2196F3",
  marginRight: "10px",
};

const delButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#f44336",
};
