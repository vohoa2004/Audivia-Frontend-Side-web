import apiClient from "@/utils/apiClient";

// vo 1 tour => check co tour progress
// co => get progress, get checkpoint progress
// ko => tao progress

// bam vo checkpoint nao => tao progress cho checkpoint do
export const getTourProgress = async (userId: string, tourId: string) => {
    try {
        const response = await apiClient.get(`/user-tour-progress/users/${userId}/tours/${tourId}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy tour progress:', error);
        throw error;
    }
}

export const getTourProgressById = async (id: string) => {
    try {
        const response = await apiClient.get(`/user-tour-progress/${id}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy tour progress:', error);
        throw error;
    }
}

export const updateTourProgress = async (id: string, progressData: any) => {
    try {
        const response = await apiClient.put(`/user-tour-progress/${id}`, progressData);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật tour progress:', error);
        throw error;
    }
}

export const createTourProgress = async (progressData: any) => {
    try {
        const response = await apiClient.post(`/user-tour-progress`, progressData);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tạo tour progress:', error);
        throw error;
    }
}

//------------ Checkpoint progress
export const getCheckpointProgressById = async (id: string) => {
    try {
        const response = await apiClient.get(`/user-checkpoint-progress/${id}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy checkpoint progress:', error);
        throw error;
    }
}

export const updateCheckpointProgress = async (id: string, progressData: any) => {
    try {
        console.log(id, progressData);
        const response = await apiClient.put(`/user-checkpoint-progress/${id}`, progressData);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật checkpoint progress:', error);
        throw error;
    }
}

export const createCheckpointProgress = async (progressData: any) => {
    try {
        console.log(progressData);
        const response = await apiClient.post(`/user-checkpoint-progress`, progressData);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tạo checkpoint progress:', error);
        throw error;
    }
}

export const getByTourProgressAndCheckpoint = async (tourProgressId: string, checkpointId: string) => {
    try {
        const response = await apiClient.get(`/user-checkpoint-progress/tour-progress/${tourProgressId}/checkpoints/${checkpointId}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy checkpoint progress theo tour progress và checkpoint:', error);
        throw error;
    }
}
