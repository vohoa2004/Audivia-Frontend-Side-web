import axios from 'axios';

// Tạo instance Axios cơ bản
const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;