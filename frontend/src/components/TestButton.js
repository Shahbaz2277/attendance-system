import React, { useState } from "react";
import { testBackend } from "../api/api";

const TestButton = () => {
  const [message, setMessage] = useState("");

  const handleClick = async () => {
    try {
      const response = await testBackend();
      setMessage(response.data.message); // Display backend message
    } catch (err) {
      setMessage("Backend not responding");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <button onClick={handleClick}>Test Backend</button>
      {message && <p style={{ marginTop: "20px" }}>{message}</p>}
    </div>
  );
};

export default TestButton;
