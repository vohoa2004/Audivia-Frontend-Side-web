import apiClient from '@/utils/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });

    const { accessToken, refreshToken } = response.data;

    // Lưu token vào AsyncStorage
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);

    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const register = async (username: string, email: string, password: string) => {
  try {
    const response = await apiClient.post('/auth/register', {
      userName: username,
      email,
      password,
    });

    return response.data;
  } catch (error) {
    console.error('Đăng ký thất bại:', error);
    throw error;
  }
};

export const getUserInfo = async (id: string) => {
  try {

    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi lấy thông tin người dùng:', error);
    throw error;
  }
};
export const updateUserInfo = async (id: string, data: any) => {
  try {
    await apiClient.put(`/users/${id}`, data);
  } catch (error) {
    console.error('Lỗi cập nhật thông tin người dùng:', error);
    throw error;
  }
};

export const loginWithGoogle = async (googleToken: string) => {

  try {
    const response = await apiClient.post('/auth/google-login', {
      token: googleToken,
    });

    const { accessToken, refreshToken } = response.data;

    // Store tokens in AsyncStorage
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);

    return response.data;
  } catch (error: any) {
    console.error('Google login failed:', error);
    throw error;
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await apiClient.post('/auth/forgot-password', {
      email,
    });
    return response.data;
  } catch (error) {
    console.error('Forgot password request failed:', error);
    throw error;
  }
};

export const verifyResetCode = async (email: string, code: string) => {
  try {
    const response = await apiClient.post('/auth/verify-reset-code', {
      email,
      otp: parseInt(code)
    });
    return response.data;
  } catch (error) {
    console.error('Code verification failed:', error);
    throw error;
  }
};

export const resetPassword = async (email: string, newPassword: string) => {
  try {
    const response = await apiClient.post('/auth/reset-password', {
      email,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error('Password reset failed:', error);
    throw error;
  }
};

