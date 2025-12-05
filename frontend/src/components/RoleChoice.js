import React from "react";
import { useNavigate } from "react-router-dom";

function RoleChoice() {
  const navigate = useNavigate();

  return (
    <div style={{ marginTop: "30px" }}>
      <button onClick={() => navigate("/professor")} style={{ margin: "10px", padding: "10px 20px" }}>
        Professor
      </button>
      <button onClick={() => navigate("/student")} style={{ margin: "10px", padding: "10px 20px" }}>
        Student
      </button>
    </div>
  );
}

export default RoleChoice;
