import apiClient from "@/utils/apiClient"

export const writeReviewTour = async (
  title: string,
  rating: number,
  content: string,
  tourId: string,
  createdBy: string,
) => {
  try {
    const imageUrl = 'string'
    const response = await apiClient.post('/tour-reviews', {
      title, imageUrl, content, rating, tourId, createdBy
    })
    console.log('TEST NÈ', response.data)
    return response.data
  } catch (error) {
    console.error('Lỗi tạo tour đánh giá:', error)
    throw error
  }
}
export const getReviewTourByTourId = async (tourId: string) => {
  try {
    const response = await apiClient.get(`/tour-reviews/tour/${tourId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy tour đánh giá:', error);
    throw error;
  }
}

export const getReviewTourByTourIdAndUserId = async (tourId: string, userId: string) => {
  try {
    const response = await apiClient.get(`/tour-reviews/tours/${tourId}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy tour đánh giá:', error);
    throw error;
  }
}

export const updateReviewTour = async (reviewId: string, data: { rating: number; content: string; title: string }) => {
  try {
    const response = await apiClient.put(`/tour-reviews/${reviewId}`, data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật tour đánh giá:', error);
    throw error;
  }
}

export const deleteReviewTour = async (reviewId: string) => {
  try {
    const response = await apiClient.delete(`/tour-reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa tour đánh giá:', error);
    throw error;
  }
}
