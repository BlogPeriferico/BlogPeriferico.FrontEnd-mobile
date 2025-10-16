import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.15.7:8080/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
