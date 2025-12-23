import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { studentLogin, studentSetPassword } from "../api";

export default function StudentLogin() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [firstLogin, setFirstLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ---------------- LOGIN ----------------
  const handleLogin = async () => {
    if (!studentId) {
      alert("Enter Student ID");
      return;
    }

    setLoading(true);
    try {
      const res = await studentLogin({
        student_id: studentId,
        password: password || "",
      });

      if (!res.valid) {
        alert(res.error || "Invalid credentials");
        return;
      }

      if (res.first_login === true) {
        setFirstLogin(true);
        return;
      }

      localStorage.setItem("student", JSON.stringify(res));
      navigate("/student-dashboard");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- SET PASSWORD ----------------
  const handleSetPassword = async () => {
    if (!newPassword) {
      alert("Enter new password");
      return;
    }

    setLoading(true);
    try {
      const res = await studentSetPassword({
        student_id: studentId,
        password: newPassword,
      });

      if (!res.valid) {
        alert(res.error || "Failed to set password");
        return;
      }

      alert("Password set successfully. Please login.");

      setFirstLogin(false);
      setPassword("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      alert("Error setting password");
    } finally {
      setLoading(false);
    }
  };

  const goHome = () => navigate("/");

  return (
    <div style={{ display: "flex", fontFamily: "'Segoe UI', Tahoma" }}>
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
        <div onClick={goHome} style={sidebarIconStyle}>
          🏠
          <span style={{ fontSize: "12px", marginTop: "4px" }}>Home</span>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "40px", textAlign: "center", position: "relative" }}>
        {/* Back arrow in top-left corner */}
        <div onClick={goHome} style={backArrowStyle}>
          ←
        </div>

        <h2>{firstLogin ? "Set Password" : "Student Login"}</h2>

        <input
          style={styles.input}
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          disabled={firstLogin}
        />
        <br />

        {!firstLogin ? (
          <>
            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button style={styles.button} onClick={handleLogin}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </>
        ) : (
          <>
            <input
              style={styles.input}
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <br />
            <button style={styles.button} onClick={handleSetPassword}>
              {loading ? "Saving..." : "Set Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------- STYLES ----------------
const styles = {
  input: {
    padding: "10px",
    fontSize: "16px",
    margin: "10px",
    width: "250px",
  },
  button: {
    padding: "12px 30px",
    fontSize: "16px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

const sidebarIconStyle = {
  color: "white",
  fontSize: "32px",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const backArrowStyle = {
  position: "absolute",
  left: "20px",
  top: "20px",
  fontSize: "28px",
  cursor: "pointer",
};
