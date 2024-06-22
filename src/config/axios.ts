import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://encyclopedia-backend.onrender.com/api',
  maxBodyLength: Infinity,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
