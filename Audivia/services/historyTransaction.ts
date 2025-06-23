import { ChatRoom, Post, TransactionHistory } from "@/models";
import apiClient from "@/utils/apiClient";

interface CreateTransactionHistoryParams {
  userId: string;
  tourId: string;
  amount: number;
  description: string;
  type: string;
  status: string;
}

export const getHistoryTransactionByUserId = async (userId: string) => {
  try {
    const response = await apiClient.get(`/transaction-histories/transaction/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching history transaction:', error);
    throw error;
  }
}

export const checkUserPurchasedTour = async (userId: string, tourId: string) => {
  try {
    console.warn(userId);
    console.warn(tourId);
    console.log(userId, tourId)
    const response = await apiClient.get(`/transaction-histories/user/${userId}/tour/${tourId}`);
    console.warn(response.data);

    return response.data;
  } catch (error) {
    console.error('Error checking user purchased tour:', error);
    throw error;
  }
}

export const createTransactionHistory = async (params: CreateTransactionHistoryParams): Promise<TransactionHistory> => {
  try {
    const response = await apiClient.post(`/transaction-histories`, params)
    return response.data.response
  } catch (error) {
    console.error('Error creating transaction history:', error)
    throw error
  }
}

export const getPaymentTransactionHistory = async (userId: string) => {
  try {
    const response = await apiClient.get(`/payment-transaction/${userId}`)
    return response.data.response
  } catch (error) {
    console.error('Error fetching payment transaction histories:', error)
  }
}
export const updateAudioCharacterId = async (id: string, audioCharacterId: string) => {
  try {
    const response = await apiClient.put(`/transaction-histories/character/${id}`, {
      audioCharacterId
    })
    return response.data.response
  } catch (error) {
    console.error('Error updating audio character ID:', error)
  }
}
