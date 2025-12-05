import React, { useState } from "react";
import { loginProfessor } from "../../api";

const ProfessorLogin = ({ goBack }) => {
  const [profId, setProfId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const res = await loginProfessor({ prof_id: profId, password });
      setMessage(res.data.message);
    } catch (err) {
      if (err.response && err.response.data) {
        setMessage(err.response.data.detail);
      } else {
        setMessage("Login failed");
      }
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Professor Login</h2>
      <input
        type="text"
        placeholder="Professor ID"
        value={profId}
        onChange={(e) => setProfId(e.target.value)}
      /><br /><br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />
      <button onClick={handleLogin}>Login</button>
      <button onClick={goBack} style={{ marginLeft: "10px" }}>Back</button>
      <p>{message}</p>
    </div>
  );
};

export default ProfessorLogin;
