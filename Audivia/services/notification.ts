import apiClient from "@/utils/apiClient";

interface Notification {
    id: string
    userId: string
    content: string
    type: string
    isRead: boolean
    createdAt: Date
    tourId: string
    timeAgo: string
}

interface UpdateNotificationParams {
    notificationId: string;
    userId: string
    isRead: boolean;
}

interface CreateNotificationParams {
    userId: string
    tourId?: string
    content: string
    type: string
    isRead: boolean
}

export const getNotificationsByUser = async (userId: string) => {
    try {
        const response = await apiClient.get(`/notifications/user/${userId}`)
        return response.data.response
    } catch (error) {
        console.log('Error at notification service: ', error)
        return []
    }
}

export const updateStatusNotification = async ({ notificationId, userId, isRead }: UpdateNotificationParams) => {
    try {
        const response = await apiClient.put(`/notifications/${notificationId}`, { userId,isRead })
        return response.data
    } catch (error) {
        console.log('Error updating notification status: ', error)
        throw error
    }
}

export const createNotification = async (notification: CreateNotificationParams) => {
    try {
        const response = await apiClient.post('/notifications', notification)
        return response.data.response
    } catch (error) {
        console.log('Error creating notification: ', error)
        throw error
    }
}

export const countUnreadNotifications = async (userId: string) => {
    try {
        const response = await apiClient.get(`/notifications/unread-count/${userId}`)
        return response.data
    } catch (error) {
        console.log('Error counting unread notification: ', error)
    }
}

export const deleteNotification = async (notificationId: string) => {
    try {
        const response = await apiClient.delete(`/notifications/${notificationId}`)
        return response.data
    } catch (error) {
        console.log('Error deleting notification: ', error)
        throw error
    }
}