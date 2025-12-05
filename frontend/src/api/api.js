import axios from "axios";

const API = "http://127.0.0.1:8000";

export const registerProfessor = (data) => axios.post(`${API}/professor/register`, data);
export const loginProfessor = (data) => axios.post(`${API}/professor/login`, data);
export const addCourse = (profId, data) => axios.post(`${API}/professor/add_course/${profId}`, data);

export const registerStudent = (data) => axios.post(`${API}/student/register`, data);
export const loginStudent = (data) => axios.post(`${API}/student/login`, data);
