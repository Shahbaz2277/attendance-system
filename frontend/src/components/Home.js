import React from "react";
import RoleChoice from "./RoleChoice";

function Home() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Electronics Department</h1>
      <h3>Attendance Management System</h3>
      <RoleChoice />
    </div>
  );
}

export default Home;
