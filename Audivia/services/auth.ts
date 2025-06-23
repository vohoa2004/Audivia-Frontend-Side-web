import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const TOKEN_KEY = '@auth_token';
const REFRESH_TOKEN_KEY = '@refresh_token';

export const authService = {
  // Save tokens
  async saveTokens(accessToken: string, refreshToken: string) {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, accessToken);
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } catch (error) {
      console.error('Error saving tokens:', error);
    }
  },

  // Get access token
  async getAccessToken() {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  },

  // Get refresh token
  async getRefreshToken() {
    try {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  },

  // Check if user is authenticated
  async isAuthenticated() {
    const token = await this.getAccessToken();
    return !!token;
  },

  // Logout
  async logout() {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
}; 