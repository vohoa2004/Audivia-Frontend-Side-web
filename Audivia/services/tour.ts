import apiClient from "@/utils/apiClient";

export const getTop3Tours = async () => {
  try {
    const response = await apiClient.get('/tours?Sort=ratingDesc&Top=3');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tour:', error);
    throw error;
  }
}
export const getAllTours = async (params?: { PageIndex?: number, PageSize?: number, Title?: string }) => {
  try {
    const response = await apiClient.get('/tours', { params });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tour:', error);
    throw error;
  }
}
export const getTourById = async (tourId: string) => {
  try {
    const response = await apiClient.get(`/tours/${tourId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy tour:', error);
    throw error;
  }
}
export const getToursByTypeId = async (typeId: string, params?: { PageIndex?: number, PageSize?: number, Title?: string }) => {
  try {
    const queryParams = { ...params, TourTypeId: typeId, PageSize: 5 };
    const response = await apiClient.get('/tours', { params: queryParams });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tour:', error);
    throw error;
  }
}
export const getTourAudioById = async () => {
  try {
    const response = await apiClient.get(`/checkpoint-audios`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy tour audio:', error);
    throw error;
  }
}
export const getTourAudioByCheckpointId = async (checkpointId: string, characterId: string) => {
  try {
    const response = await apiClient.get(`/checkpoint-audios/checkpoint/${checkpointId}/character/${characterId}`)
    return response.data
  } catch (error) {
    console.error('Lỗi lấy tour audio:', error)
    throw error
  }
}
export const getNextAudioByCheckpointId = async (checkpointId: string) => {
  try {
    const response = await apiClient.get(`/checkpoint-audios/next/${checkpointId}`)
    return response.data
  } catch (error) {
    console.error('Lỗi lấy tour audio kế tiếp:', error)
    throw error
  }
}
export const getPrevAudioByCheckpointId = async (checkpointId: string) => {
  try {
    const response = await apiClient.get(`/checkpoint-audios/prev/${checkpointId}`)
    return response.data
  } catch (error) {
    console.error('Lỗi lấy tour audio phía trước:', error)
    throw error
  }
}
export const hasTourAudioForTour = async (tourId: string) => {
  try {
    const response = await apiClient.get(`/checkpoint-audios/tour?tour=${tourId}`)
    return response.data
  } catch (error) {
    console.error('Lỗi lấy tour audio:', error)
    throw error
  }
}
export const getSuggestedTours = async (userId: string | undefined, long: number, lat: number, radius: number) => {
  try {
    const response = await apiClient.get(`/tours/suggested?UserId=${userId}&Longitude=${long}&Latitude=${lat}&Radius=${radius}`)
    return response.data
  } catch (error) {
    console.error('Lỗi lấy tour audio:', error)
    throw error
  }
}
