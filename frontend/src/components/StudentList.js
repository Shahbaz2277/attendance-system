import React, { useState, useEffect } from "react";
import { getStudents, addStudent } from "../api/api";

export default function StudentList({ token }) {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");

  const fetchStudents = async () => {
    try {
      const res = await getStudents(token);
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addStudent({ name, roll_no: rollNo }, token);
      setName("");
      setRollNo("");
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.detail || "Error adding student");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div>
      <h2>Students</h2>
      <form onSubmit={handleAdd}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          placeholder="Roll No"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          required
        />
        <button type="submit">Add Student</button>
      </form>

      <ul>
        {students.map((s) => (
          <li key={s.id}>
            {s.name} - {s.roll_no}
          </li>
        ))}
      </ul>
    </div>
  );
}
