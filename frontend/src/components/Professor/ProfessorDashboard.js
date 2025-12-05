import React, { useState } from "react";
import { addCourse } from "../../api";

const ProfessorDashboard = () => {
  const [title, setTitle] = useState("");
  const [batch, setBatch] = useState("");
  const [studentIds, setStudentIds] = useState("");
  const [message, setMessage] = useState("");

  const professorId = localStorage.getItem("professorId");

  const handleAddCourse = async () => {
    if (!title || !batch || !studentIds) {
      alert("Fill all fields");
      return;
    }

    try {
      const response = await addCourse(professorId, {
        title,
        batch,
        student_ids: studentIds.split(",").map((id) => id.trim()),
      });
      setMessage(response.message);
      setTitle("");
      setBatch("");
      setStudentIds("");
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.detail || "Error adding course");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", textAlign: "center" }}>
      <h2>Professor Dashboard</h2>
      <input
        placeholder="Course Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        placeholder="Batch"
        value={batch}
        onChange={(e) => setBatch(e.target.value)}
      />
      <input
        placeholder="Student IDs (comma separated)"
        value={studentIds}
        onChange={(e) => setStudentIds(e.target.value)}
      />
      <button onClick={handleAddCourse}>Add Course</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ProfessorDashboard;
