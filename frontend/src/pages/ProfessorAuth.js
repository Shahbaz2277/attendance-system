import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { professorLogin, professorRegister } from "../api";

export default function ProfessorDashboard() {
  const [prof_id, setProfId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // default to login
  const navigate = useNavigate();

  // ✅ Auto-login if already remembered
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

    if (isLogin) {
      try {
        const res = await professorLogin({ prof_id, password });
        if (res?.valid) {
          if (rememberMe) localStorage.setItem("prof_id", prof_id);
          navigate("/batch", { state: { prof_id, name: res.name } });
        } else {
          alert(res.error || "Invalid login credentials");
        }
      } catch (err) {
        alert("Login failed: " + (err.message || "Unknown error"));
      }
    } else {
      try {
        const res = await professorRegister({ prof_id, name, password });
        if (res.error) {
          alert(res.error); // e.g., duplicate ID
        } else {
          alert("Registered successfully! You can now login.");
          setName("");
          setPassword("");
          setIsLogin(true); // switch to login after successful registration
        }
      } catch (err) {
        alert("Registration failed: " + (err.message || "Unknown error"));
      }
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "60px auto",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        fontFamily: "Arial",
        position: "relative",
      }}
    >
      {/* 🔙 Back Arrow */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: "15px",
          right: "15px",
          background: "none",
          border: "none",
          fontSize: "22px",
          cursor: "pointer",
        }}
        title="Back"
      >
        ←
      </button>

      <h2 style={{ textAlign: "center" }}>Professor {isLogin ? "Login" : "Register"}</h2>

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

      {/* ✅ Remember Me */}
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

      <p
        style={{
          marginTop: "15px",
          cursor: "pointer",
          color: "#007BFF",
          textAlign: "center",
        }}
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin
          ? "Don't have an account? Register"
          : "Already have an account? Login"}
      </p>
    </div>
  );
}

// ---------- Styles ----------
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
