import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tạo instance Axios cơ bản
const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để gắn token vào mỗi request
apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;