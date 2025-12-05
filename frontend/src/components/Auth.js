import React, { useState } from "react";
import axios from "axios";

const Auth = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleSetPassword = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/set_password", {
        id: username,
        password,
      });
      setMessage(res.data.message);
      onLoginSuccess(res.data);
    } catch (err) {
      setMessage(err.response?.data?.detail || "Error setting password");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/login", {
        id: username,
        password,
      });
      setMessage(res.data.message);
      onLoginSuccess(res.data);
    } catch (err) {
      setMessage(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f8f9fa",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "10px" }}>
        Electronics Department
      </h1>
      <h4 style={{ marginBottom: "30px", color: "gray" }}>Attendance Management System</h4>

      {/* Input Fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px", width: "250px" }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "14px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            width: "100%", // Same width for both inputs
            boxSizing: "border-box",
          }}
        />

        <div style={{ position: "relative", width: "100%" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "10px",
              fontSize: "14px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              width: "100%", // Same width
              boxSizing: "border-box",
            }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#007bff",
              fontSize: "12px",
            }}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <button
          onClick={handleSetPassword}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "6px 12px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          Register
        </button>

        <button
          onClick={handleLogin}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "6px 12px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          Login
        </button>
      </div>

      {/* Message */}
      {message && (
        <p style={{ marginTop: "15px", color: "red", fontSize: "12px", textAlign: "center" }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Auth;
