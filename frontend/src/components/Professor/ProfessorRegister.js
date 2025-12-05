import React, { useState } from "react";
import { registerProfessor } from "../../api";

const ProfessorRegister = ({ goBack }) => {
  const [profId, setProfId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
      const res = await registerProfessor({ prof_id: profId, name, password });
      setMessage(res.data.message);
    } catch (err) {
      if (err.response && err.response.data) {
        setMessage(err.response.data.detail);
      } else {
        setMessage("Registration failed");
      }
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Professor Register</h2>
      <input
        type="text"
        placeholder="Professor ID (PROF001)"
        value={profId}
        onChange={(e) => setProfId(e.target.value)}
      /><br /><br />
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      /><br /><br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />
      <button onClick={handleRegister}>Register</button>
      <button onClick={goBack} style={{ marginLeft: "10px" }}>Back</button>
      <p>{message}</p>
    </div>
  );
};

export default ProfessorRegister;
