import apiClient from "@/utils/apiClient"

export const getTourCheckpointById = async (checkpointId: string) => {
    try {
        const response = await apiClient.get(`/tour-checkpoints/${checkpointId}`);
        return response.data.response
    } catch (error) {
        console.error("Error fetching tour checkpoint", error);
        
    }
}