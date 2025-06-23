import apiClient from "@/utils/apiClient";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatRoom, ChatRoomMember, Message } from "@/models";

interface CreateChatRoomParams {
    name: string;
    createdBy: string;
    type: string;
}

interface CreateChatRoomMemberParams {
    chatRoomId: string;
    userId: string;
    nickname: string;
    isHost: boolean;
}

interface CreateMessageParams {
    content: string;
    senderId: string;
    chatRoomId: string;
    type?: string;
    status: string;
}

interface UpdateMessageParams {
    content: string;
    status?: string;
}

interface UpdateChatRoomMemberParams {
    nickname: string;
}

export const createChatRoom = async (params: CreateChatRoomParams): Promise<ChatRoom> => {
    try {
        const response = await apiClient.post('/chat-rooms', {
            name: params.name,
            createdBy: params.createdBy,
            type: params.type,
            isActive: true
        });
        return response.data.response;
    } catch (error) {
        console.error('Lỗi tạo phòng chat', error);
        throw error;
    }
}
export const getChatRoomById = async (id: string): Promise<any> => {
    try{
       const response = await apiClient.get(`/chat-rooms/${id}`);
       console.warn(response.data.response);
       
       return response.data.response
    }
    catch(error){
        console.error("Không thể lấy thông tin chat room");
        
    }
}

export const createChatRoomMember = async (params: CreateChatRoomMemberParams): Promise<ChatRoomMember> => {
    try {
        const response = await apiClient.post('/chat-room-members', {
            chatRoomId: params.chatRoomId,
            userId: params.userId,
            nickname: params.nickname,
            isHost: params.isHost
        });
        console.log(response);
        
        return response.data;
    } catch (error) {
        console.error('Lỗi thêm thành viên vào phòng chat', error);
        throw error;
    }
}





export const updateChatRoomMember = async (id: string, params: UpdateChatRoomMemberParams): Promise<void> => {
    try {
        await apiClient.put(`/chat-room-members/${id}`, params);
    } catch (error) {
        console.error('Lỗi cập nhật thông tin thành viên', error);
        throw error;
    }
}

export const deleteChatRoomMember = async (id: string): Promise<void> => {
    try {
        await apiClient.delete(`/chat-room-members/${id}`);
    } catch (error) {
        console.error('Lỗi xóa thành viên', error);
        throw error;
    }
}

export const getPrivateRoom = async (user1Id: string, user2Id: string): Promise<ChatRoom> => {
    try {
        const response = await apiClient.post(`/chat-room-members/private/${user1Id}/${user2Id}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi lấy phòng chat riêng tư', error);
        throw error;
    }
}

export const getChatRoomsByUserId = async (userId: string): Promise<ChatRoom[]> => {
    try {
        const response = await apiClient.get(`/chat-rooms/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi lấy danh sách phòng chat của người dùng', error);
        throw error;
    }
}

export const createMessage = async (params: CreateMessageParams): Promise<Message> => {
    try {
        const response = await apiClient.post('/messages', params);
        return response.data;
    } catch (error) {
        console.error('Lỗi gửi tin nhắn', error);
        throw error;
    }
}

export const getAllMessages = async (): Promise<Message[]> => {
    try {
        const response = await apiClient.get('/messages');
        return response.data;
    } catch (error) {
        console.error('Lỗi lấy danh sách tin nhắn', error);
        throw error;
    }
}

export const getMessageById = async (id: string): Promise<Message> => {
    try {
        const response = await apiClient.get(`/messages/${id}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi lấy tin nhắn', error);
        throw error;
    }
}

export const updateMessage = async (id: string, params: UpdateMessageParams): Promise<Message> => {
    try {
        const response = await apiClient.put(`/messages/${id}`, params);
        return response.data;
    } catch (error) {
        console.error('Lỗi cập nhật tin nhắn', error);
        throw error;
    }
}

export const deleteMessage = async (id: string): Promise<void> => {
    try {
        await apiClient.delete(`/messages/${id}`);
    } catch (error) {
        console.error('Lỗi xóa tin nhắn', error);
        throw error;
    }
}

export const getMessagesByChatRoom = async (chatRoomId: string): Promise<Message[]> => {
    try {
        const response = await apiClient.get(`/messages/chatroom/${chatRoomId}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi lấy tin nhắn của phòng chat', error);
        throw error;
    }
}



