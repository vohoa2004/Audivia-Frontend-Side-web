import apiClient from "@/utils/apiClient"

export const createSaveTour = async (userId: string, tourId: string ) => {
    try {
        const plannedTime = null
        const response = await apiClient.post('/save-tours', {
            userId, tourId, plannedTime
        })
        return response.data
    } catch (error) {
        console.error('Lỗi tạo tour yêu thích', error)
        throw error
    }
}
export const getAllSaveTourByUserId = async(userId: string) => {
    try {
        const response = await apiClient.get(`/save-tours/user/${userId}`)
        return response.data
    } catch (error) {
        console.error('Lỗi lấy danh sách yêu thích', error)
        throw error
    }
}
export const getSaveTourById = async(id: string) => {
    try {
        const response = await apiClient.get(`/save-tours/${id}`)
        return response.data
    } catch (error) {
        console.error('Lỗi lấy tour yêu thích', error)
        throw error
    }
}
export const deleteSaveTour = async (id: string) => {
    try {
        await apiClient.delete(`/save-tours/${id}`)
    } catch (error: any) {
        console.error('Lỗi xóa tour yêu thích:', error.response?.data || error.message)
        throw error
    }
}
export const updateSaveTour = async (
    id: string, 
    plannedTime:string
  ) => {
    try {
        
      const rs =  await apiClient.put(`/save-tours/${id}`,  { plannedTime })
      
    } catch (error: any) {
        console.error('Lỗi cập nhật thông tour yêu thích:', error.response?.data || error.message)
        throw error
    }
  }
  