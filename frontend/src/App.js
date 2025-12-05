import React, { useState } from "react";
import ProfessorRegister from "./components/Professor/ProfessorRegister";
import ProfessorLogin from "./components/Professor/ProfessorLogin";

function App() {
  const [page, setPage] = useState("choice"); // choice / register / login

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Electronics Department</h1>
      <h3>Attendance Management System</h3>

      {page === "choice" && (
        <>
          <button onClick={() => setPage("register")} style={{ margin: "10px", padding: "10px 20px" }}>
            Professor Register
          </button>
          <button onClick={() => setPage("login")} style={{ margin: "10px", padding: "10px 20px" }}>
            Professor Login
          </button>
        </>
      )}

      {page === "register" && <ProfessorRegister goBack={() => setPage("choice")} />}
      {page === "login" && <ProfessorLogin goBack={() => setPage("choice")} />}
    </div>
  );
}

export default App;
