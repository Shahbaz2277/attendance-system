import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const registerProfessor = async (data) => {
  return axios.post(`${API_URL}/professor/register`, data);
};

export const loginProfessor = async (data) => {
  return axios.post(`${API_URL}/professor/login`, data);
};
