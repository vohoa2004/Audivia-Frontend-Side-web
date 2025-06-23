import apiClient from "@/utils/apiClient";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const createPaymentIntent = async (userId: string, returnUrl: string, cancelUrl: string, amount: number, description: string) => {
  const token = await AsyncStorage.getItem('accessToken');
  const response = await apiClient.post(`/payment/vietqr`, {
    userId,
    returnUrl,
    cancelUrl,
    amount,
    description,
  });
  return response.data;
};

export const checkPaymentStatus = async (paymentLinkId: string) => {
  const PAYOS_CLIENT_ID = process.env.EXPO_PUBLIC_PAYOS_CLIENT_ID;
  const PAYOS_API_KEY = process.env.EXPO_PUBLIC_PAYOS_CLIENT_API;
  const response = await apiClient.get(`https://api-merchant.payos.vn/v2/payment-requests/${paymentLinkId}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-client-id': PAYOS_CLIENT_ID,
      'x-api-key': PAYOS_API_KEY
    },
  });

  return response.data.data;
};

