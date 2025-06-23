import apiClient from "@/utils/apiClient"

export interface ChatBotMessage {
    reply: string,
    sender: number,
    timestamp: string,
    id?: string;
}


export const sendChatMessage = async (
    text: string,
    clientSessionId: string,
    userId: string
): Promise<ChatBotMessage> => {
    try {
        const chatMessage = {
            text: text,
            clientSessionId: clientSessionId,
            userId: userId
        }
        const response = await apiClient.post('/chat-bot/send', chatMessage)
        return response.data
    } catch (error: any) {
        console.error('Lỗi gửi tin nhắn chat:', error.response?.data || error.message)
        throw error
    }
}

export const getChatHistory = async (
    clientSessionId: string,
    pageNumber: number,
    pageSize: number
): Promise<ChatBotMessage[]> => {
    try {
        const response = await apiClient.get(`/chat-bot/history/${clientSessionId}?page=${pageNumber}&limit=${pageSize}`)
        return Array.isArray(response.data) ? response.data : (response.data?.response || []);
    } catch (error: any) {
        console.error('Lỗi lấy lịch sử trò chuyện:', error.response?.data || error.message)
        return [];
    }
}