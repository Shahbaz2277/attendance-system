const BASE_URL = "http://127.0.0.1:8000";

// ---------------- Generic response handler ----------------
const handleResponse = async (res) => {
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : {};

  if (!res.ok) {
    throw new Error(data.detail || JSON.stringify(data) || `Error: ${res.status}`);
  }
  return data;
};

// ---------------- PROFESSOR ----------------
export const professorRegister = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/professor/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  } catch (error) {
    return { error: error.message };
  }
};

export const professorLogin = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/professor/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

// ---------------- COURSE ----------------
export const addCourse = async ({ course_name, batch_id, prof_id }) => {
  try {
    const res = await fetch(`${BASE_URL}/course/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        course_name,
        batch_id: Number(batch_id),
        prof_id,
      }),
    });
    return await handleResponse(res);
  } catch (error) {
    return { error: error.message };
  }
};

export const getCoursesByBatch = async (batch_id, prof_id) => {
  try {
    const res = await fetch(`${BASE_URL}/courses/${batch_id}/${prof_id}`);
    return await handleResponse(res);
  } catch (error) {
    return [];
  }
};

export const deleteCourse = async (course_id) => {
  try {
    const res = await fetch(`${BASE_URL}/course/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course_id }),
    });
    return await handleResponse(res);
  } catch (error) {
    return { deleted: false, error: error.message };
  }
};

// ---------------- STUDENT ----------------
export const addEnrollStudent = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/student/add-enroll`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  } catch (error) {
    return { error: error.message };
  }
};

export const studentLogin = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/student/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

export const getStudentsInCourse = async (course_id) => {
  try {
    const res = await fetch(`${BASE_URL}/course/students/${course_id}`);
    return await handleResponse(res);
  } catch (error) {
    return [];
  }
};

// ✅ PERMANENT DELETE STUDENT + ATTENDANCE
export const deleteStudent = async (student_id, course_id) => {
  const res = await fetch(
    `${BASE_URL}/student/delete?student_id=${student_id}&course_id=${course_id}`,
    { method: "DELETE" }
  );
  return await handleResponse(res);
};

// ---------------- ATTENDANCE ----------------
export const markAttendance = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/attendance/mark`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  } catch (error) {
    return { error: error.message };
  }
};

export const getAllAttendanceForCourse = async (course_id) => {
  try {
    const res = await fetch(`${BASE_URL}/attendance/course/all/${course_id}`);
    return await handleResponse(res);
  } catch (error) {
    return {};
  }
};
// ---------------- STUDENT SET PASSWORD (FIRST LOGIN) ----------------
export const studentSetPassword = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/student/set-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  } catch (error) {
    return { valid: false, error: error.message };
  }
};
