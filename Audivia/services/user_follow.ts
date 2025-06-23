import apiClient from "@/utils/apiClient"

export const createUserFollow = async (followerId: string, followingId: string ) => {
    try {
        const response = await apiClient.post('/user-follows', {
                followerId, followingId
        })
        return response.data
    } catch (error) {
        console.error('Lỗi tạo thêm bạn', error)
        throw error
    }
}
export const getUserFollows = async (currentUserId: string, targetUserId: string ) => {
    try {
        const response = await apiClient.get(`/user-follows/status?CurrentUserId=${currentUserId}&TargetUserId=${targetUserId}`)
      //  console.log('Danh sách bạn bè:', response.data)
        return response.data
        } catch (error) {
            console.error('Lỗi lấy danh sách bạn bè:', error)
            throw error
        }
}
export const getUserFriends = async (userId: string) => {
    try {
        const response = await apiClient.get(`/user-follows/friends?userId=${userId}`)
     //   console.log('Danh sách bạn bè:', response.data)
        return response.data
    } catch (error) {
        console.error('Lỗi lấy danh sách bạn bè:', error)
        throw error
    }
}
export const deleteUserFollow = async (followerId: string, followingId: string) => {
    try {
        await apiClient.delete(`/user-follows?FollowerId=${followerId}&FollowingId=${followingId}`)
    } catch (error: any) {
        console.error('Lỗi xóa thêm bạn:', error.response?.data || error.message)
        throw error
    }
}
