import apiClient from "@/utils/apiClient";

export const getTourTypes = async () => {
  try {
    const response = await apiClient.get('/tour-types');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách loại tour:', error);
    throw error;
  }
}
export const updateSaveTour = async (
  id: string, 
  plannedTime:string
) => {
  try {
      await apiClient.put(`/posts/${id}`, plannedTime)
  } catch (error: any) {
      console.error('Lỗi cập nhật thông tour yêu thích:', error.response?.data || error.message)
      throw error
  }
}
