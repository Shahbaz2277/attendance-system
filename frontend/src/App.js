import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import BatchSelect from "./pages/BatchSelect";
import CourseAdd from "./pages/CourseAdd";
import StudentAdd from "./pages/StudentAdd";
import AttendanceMark from "./pages/AttendanceMark";
import StudentLogin from "./pages/StudentLogin";
import StudentDashboard from "./pages/StudentDashboard";
import CourseAttendance from "./pages/CourseAttendance"; // NEW

function App() {
  return (
    <Router>
      <Routes>
        {/* Home page */}
        <Route path="/" element={<Home />} />

        {/* Professor/Admin */}
        <Route path="/professor" element={<ProfessorDashboard />} />
        <Route path="/batch" element={<BatchSelect />} />
        <Route path="/course" element={<CourseAdd />} />
        <Route path="/student" element={<StudentAdd />} />
        <Route path="/attendance" element={<AttendanceMark />} />

        {/* Student */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/course-attendance" element={<CourseAttendance />} /> {/* NEW */}

        {/* Catch-all redirects to Home */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
