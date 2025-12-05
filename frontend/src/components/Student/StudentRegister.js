import React, { useState } from "react";
import { registerStudent } from "../../api";
import { useNavigate } from "react-router-dom";

const StudentRegister = () => {
  const [student_id, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [batch, setBatch] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    // Validate all fields
    if (!student_id || !name || !batch || !password) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const response = await registerStudent({
        student_id,
        name,
        batch,
        password
      });
      setMessage(response.message || "Registration successful!");
      // Optional: redirect to login page
      navigate("/student/login");
    } catch (error) {
      console.error(error);
      // Show backend error properly
      const detail = error.response?.data?.detail;
      if (Array.isArray(detail)) {
        // Pydantic validation errors
        setMessage(detail.map(d => d.msg).join(", "));
      } else {
        setMessage(detail || "Registration failed");
      }
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>Student Register</h2>
      <input
        placeholder="Student ID (e.g., F22BETEN1M01001)"
        value={student_id}
        onChange={(e) => setStudentId(e.target.value)}
      />
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Batch (e.g., 22)"
        value={batch}
        onChange={(e) => setBatch(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default StudentRegister;
