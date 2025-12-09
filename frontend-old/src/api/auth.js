import axios from 'axios';
const API = axios.create({ baseURL: process.env.REACT_APP_API || 'http://localhost:4000/api'});

export const saveToken = (token) => localStorage.setItem('token', token);
export const getToken = () => localStorage.getItem('token');
export const getUser = () => {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
};
API.interceptors.request.use((config) => {
  const token = getToken();
  if(token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export default API;
