import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { professorLogin, professorRegister } from "../api";

export default function ProfessorDashboard() {
  const [prof_id, setProfId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // ✅ Auto login if remembered
  useEffect(() => {
    const savedProf = localStorage.getItem("prof_id");
    if (savedProf) {
      navigate("/batch", { state: { prof_id: savedProf } });
    }
  }, [navigate]);

  // ---------------- Handle Submit ----------------
  const handleSubmit = async () => {
    if (!prof_id || !password || (!isLogin && !name)) {
      alert("Please fill all required fields");
      return;
    }

    try {
      if (isLogin) {
        const res = await professorLogin({ prof_id, password });
        if (res?.valid) {
          if (rememberMe) localStorage.setItem("prof_id", prof_id);
          navigate("/batch", { state: { prof_id, name: res.name } });
        } else {
          alert(res.error || "Invalid login credentials");
        }
      } else {
        const res = await professorRegister({ prof_id, name, password });
        if (res.error) {
          alert(res.error);
        } else {
          alert("Registered successfully! You can now login.");
          setIsLogin(true);
          setName("");
          setPassword("");
        }
      }
    } catch (err) {
      alert("Error: " + (err.message || "Unknown error"));
    }
  };

  return (
    <div style={{ display: "flex", fontFamily: "Arial, sans-serif" }}>
      {/* 🔹 Sidebar */}
      <div style={sidebarStyle}>
        <div onClick={() => navigate("/")} style={sidebarIconStyle} title="Home">
          🏠
          <span style={sidebarLabelStyle}>Home</span>
        </div>
      </div>

      {/* 🔹 Main Content */}
      <div style={containerStyle}>
        {/* 🔙 Back Arrow (goes to Home) */}
        <button
          onClick={() => navigate("/")}
          style={backButtonStyle}
          title="Back"
        >
          ←
        </button>

        <h2 style={{ textAlign: "center" }}>
          Professor {isLogin ? "Login" : "Register"}
        </h2>

        <input
          style={inputStyle}
          placeholder="Professor ID"
          value={prof_id}
          onChange={(e) => setProfId(e.target.value)}
        />

        {!isLogin && (
          <input
            style={inputStyle}
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          style={inputStyle}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div style={{ textAlign: "left", margin: "10px 0" }}>
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />{" "}
            Remember Me
          </label>
        </div>

        <button style={buttonStyle} onClick={handleSubmit}>
          {isLogin ? "Login" : "Register"}
        </button>

        <p style={toggleTextStyle} onClick={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </p>
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
  maxWidth: "400px",
  margin: "60px auto",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  position: "relative",
};

const backButtonStyle = {
  position: "absolute",
  top: "15px",
  left: "15px",
  background: "none",
  border: "none",
  fontSize: "24px",
  cursor: "pointer",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "10px 0",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const toggleTextStyle = {
  marginTop: "15px",
  cursor: "pointer",
  color: "#007BFF",
  textAlign: "center",
};
