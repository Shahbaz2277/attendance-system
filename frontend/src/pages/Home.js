import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Electronics Department</h1>
      <h3 style={styles.subtitle}>Attendance Management System</h3>

      <div style={styles.buttonContainer}>
        {/* ✅ Professor → Login / Register Page */}
        <button
          style={buttonStyle("#4CAF50")}
          onClick={() => navigate("/professor")}
        >
          Professor
        </button>

        {/* ✅ Student → Student Login */}
        <button
          style={buttonStyle("#2196F3")}
          onClick={() => navigate("/student/login")}
        >
          Student
        </button>
      </div>
    </div>
  );
}

/* ---------- Styles ---------- */

const styles = {
  container: {
    textAlign: "center",
    marginTop: "100px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "60px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  subtitle: {
    fontSize: "24px",
    marginBottom: "50px",
    color: "#555",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
};

const buttonStyle = (bgColor) => ({
  padding: "15px 30px",
  fontSize: "18px",
  cursor: "pointer",
  borderRadius: "8px",
  backgroundColor: bgColor,
  color: "white",
  border: "none",
  minWidth: "150px",
});
