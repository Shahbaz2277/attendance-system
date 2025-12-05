import React, { useState } from "react";
import { addCourse } from "../../api";

function AddCourse() {
  const professor_id = localStorage.getItem("professor_id");
  const [title, setTitle] = useState("");
  const [batch, setBatch] = useState("");
  const [studentIds, setStudentIds] = useState("");

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const student_list = studentIds.split(",").map((id) => id.trim());
      const response = await addCourse(professor_id, { title, batch, student_ids: student_list });
      alert(response.data.message);
      setTitle("");
      setBatch("");
      setStudentIds("");
    } catch (error) {
      alert(error.response?.data?.detail || "Error adding course");
    }
  };

  return (
    <div>
      <h3>Add Course</h3>
      <form onSubmit={handleAddCourse}>
        <input type="text" placeholder="Course Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="text" placeholder="Batch (e.g., 22)" value={batch} onChange={(e) => setBatch(e.target.value)} required />
        <input type="text" placeholder="Student IDs (comma separated)" value={studentIds} onChange={(e) => setStudentIds(e.target.value)} required />
        <button type="submit" style={{ backgroundColor: "green", color: "white", padding: "5px 15px" }}>Add Course</button>
      </form>
    </div>
  );
}

export default AddCourse;
