import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  getStudentsInCourse,
  markAttendance,
  getAllAttendanceForCourse,
} from "../api";

const TOTAL_DAYS = 32;

const AttendanceMark = () => {
  const location = useLocation();
  const { course_id } = location.state || {};

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ NEW: hidden date columns
  const [hiddenDates, setHiddenDates] = useState({});

  useEffect(() => {
    if (!course_id) return;

    const loadData = async () => {
      setLoading(true);

      const studentList = await getStudentsInCourse(course_id);
      setStudents(studentList || []);

      const saved = await getAllAttendanceForCourse(course_id);

      const today = new Date();
      const recentDates = [];
      for (let i = TOTAL_DAYS - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        recentDates.push(d.toISOString().split("T")[0]);
      }

      setDates(recentDates);

      const grid = {};
      (studentList || []).forEach((s) => {
        grid[s.student_id] = recentDates.map(
          (d) => saved?.[s.student_id]?.[d] === "Present"
        );
      });

      setAttendance(grid);
      setLoading(false);
    };

    loadData();
  }, [course_id]);

  const toggleAttendance = (student_id, index) => {
    setAttendance((prev) => ({
      ...prev,
      [student_id]: prev[student_id].map((v, i) =>
        i === index ? !v : v
      ),
    }));
  };

  const changeDate = (index, value) => {
    setDates((prev) => prev.map((d, i) => (i === index ? value : d)));
  };

  // ✅ Hide / Show column
  const toggleDateVisibility = (date) => {
    setHiddenDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const saveAttendance = async () => {
    const requests = [];

    for (let i = 0; i < dates.length; i++) {
      if (hiddenDates[dates[i]]) continue;

      for (const s of students) {
        requests.push(
          markAttendance({
            student_id: s.student_id,
            course_id,
            status: attendance[s.student_id][i]
              ? "Present"
              : "Absent",
            att_date: dates[i],
          })
        );
      }
    }

    try {
      await Promise.all(requests);
      alert("Attendance saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving attendance");
    }
  };

  const calculatePercentage = (arr) => {
    if (!arr) return "0.0";
    const present = arr.filter(Boolean).length;
    return ((present / dates.length) * 100).toFixed(1);
  };

  if (!course_id) return <p>Please select a course first</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ overflowX: "auto", padding: 20 }}>
      <h2 style={{ textAlign: "center" }}>Attendance Register</h2>

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={th}>ID</th>
            <th style={th}>Name</th>

            {dates.map((d, i) =>
              hiddenDates[d] ? null : (
                <th key={i} style={th}>
                  <input
                    type="date"
                    value={d}
                    onChange={(e) =>
                      changeDate(i, e.target.value)
                    }
                    style={{ width: 120 }}
                  />
                  <br />
                  <button
                    onClick={() => toggleDateVisibility(d)}
                    style={hideBtn}
                  >
                    Hide
                  </button>
                </th>
              )
            )}

            <th style={th}>%</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s.student_id}>
              <td style={td}>{s.student_id}</td>
              <td style={td}>{s.name}</td>

              {(attendance[s.student_id] || []).map((val, i) =>
                hiddenDates[dates[i]] ? null : (
                  <td
                    key={i}
                    style={{
                      ...td,
                      backgroundColor: val
                        ? "#c8e6c9"
                        : "#ffcdd2",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={val}
                      onChange={() =>
                        toggleAttendance(s.student_id, i)
                      }
                    />
                  </td>
                )
              )}

              <td style={td}>
                {calculatePercentage(attendance[s.student_id])}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ SHOW HIDDEN DATE COLUMNS */}
      {Object.keys(hiddenDates).length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h3>Hidden Dates</h3>
          {Object.keys(hiddenDates)
            .filter((d) => hiddenDates[d])
            .map((d) => (
              <button
                key={d}
                onClick={() => toggleDateVisibility(d)}
                style={showBtn}
              >
                Show {d}
              </button>
            ))}
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: 30 }}>
        <button onClick={saveAttendance} style={btn}>
          Save Attendance
        </button>
      </div>
    </div>
  );
};

// Styles
const th = { border: "1px solid #ccc", padding: 8, background: "#f0f0f0" };
const td = { border: "1px solid #ccc", padding: 6, textAlign: "center" };

const btn = {
  padding: "12px 30px",
  background: "#2196f3",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontSize: 16,
  cursor: "pointer",
};

const hideBtn = {
  marginTop: 5,
  padding: "4px 8px",
  background: "#f44336",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: 12,
};

const showBtn = {
  margin: 5,
  padding: "6px 12px",
  background: "#4caf50",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

export default AttendanceMark;
