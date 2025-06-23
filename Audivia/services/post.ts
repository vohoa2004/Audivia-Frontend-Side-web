import apiClient from "@/utils/apiClient"
import { Post, Reaction, Comment } from "@/models"

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    response: T;
}

export const getPostByUserId = async (userId: string): Promise<ApiResponse<Post[]>> => {
    try {
        const response = await apiClient.get(`/posts/users/${userId}`)
        return response.data
    } catch (error) {
        console.error('Lỗi lấy danh sách bài đăng của người dùng', error)
        throw error
    }
}

export const getAllPosts = async (): Promise<ApiResponse<Post[]>> => {
    try {
        const response = await apiClient.get('/posts')
        return response.data
    } catch (error) {
        console.error('Lỗi lấy hết danh sách bài đăng')
        throw error
    }
}

export const createPost = async (
    images: string[],
    location: string,
    content: string,
    createdBy: string
): Promise<ApiResponse<Post>> => {
    try {

        const postData = {
            title: "string",
            images: images,
            location: location || '',
            content: content.trim(),
            createdBy: createdBy
        };

        console.log('Sending post data:', postData);

        const response = await apiClient.post('/posts', postData)
        return response.data
    } catch (error: any) {
        console.error('Lỗi tạo bài đăng:', error.response?.data || error.message)
        throw error
    }
}

export const updatePost = async (
    id: string,
    data: Partial<Post>
) => {
    try {
        await apiClient.put(`/posts/${id}`, data)
    } catch (error: any) {
        console.error('Lỗi cập nhật thông tin bài đăng:', error.response?.data || error.message)
        throw error
    }
}

export const deletePost = async (id: string): Promise<ApiResponse<void>> => {
    try {
        const response = await apiClient.delete(`/posts/${id}`)
        return response.data
    } catch (error: any) {
        console.error('Lỗi xóa bài đăng:', error.response?.data || error.message)
        throw error
    }
}

// for reactions
export const reactPost = async (type: number, postId: string, createdBy: string): Promise<ApiResponse<void>> => {
    try {
        const response = await apiClient.post(`/reactions`, { type, postId, createdBy })
        return response.data
    } catch (error: any) {
        console.error('Lỗi react bài đăng:', error.response?.data || error.message)
        throw error
    }
}

export const getUserReactions = async (userId: string): Promise<ApiResponse<Reaction[]>> => {
    try {
        const response = await apiClient.get(`/reactions/users/${userId}`)
        return response.data
    } catch (error: any) {
        console.error('Lỗi lấy danh sách reactions của user:', error.response?.data || error.message)
        throw error
    }
}

export const getReactionByUserAndPost = async (userId: string, postId: string): Promise<ApiResponse<Reaction | null>> => {
    try {
        const response = await apiClient.get(`/reactions/posts/${postId}/users/${userId}`)
        return response.data
    }
    catch (error: any) {
        throw error
    }
}

export const getPostReactions = async (postId: string): Promise<ApiResponse<Reaction[]>> => {
    try {
        const response = await apiClient.get(`/reactions/posts/${postId}`)
        return response.data
    } catch (error: any) {
        console.error('Lỗi lấy danh sách reactions của bài đăng:', error.response?.data || error.message)
        throw error
    }
}

// for comments
export const commentPost = async (content: string, postId: string, createdBy: string): Promise<ApiResponse<Comment>> => {
    try {
        const response = await apiClient.post(`/comments`, { content, postId, createdBy })
        return response.data
    } catch (error: any) {
        console.error('Lỗi comment bài đăng:', error.response?.data || error.message)
        throw error
    }
}

export const getPostComments = async (postId: string): Promise<ApiResponse<Comment[]>> => {
    try {
        const response = await apiClient.get(`/comments/posts/${postId}`)
        return response.data
    } catch (error: any) {
        console.error('Lỗi lấy danh sách comment của bài đăng:', error.response?.data || error.message)
        throw error
    }
}

export const deleteComment = async (id: string, userId: string): Promise<ApiResponse<void>> => {
    try {
        const response = await apiClient.delete(`/comments/${id}?userId=${userId}`)
        return response.data
    } catch (error: any) {
        console.error('Lỗi xóa comment:', error.response?.data || error.message)
        throw error
    }
}

export const updateComment = async (commentId: string, content: string, updatedBy: string): Promise<ApiResponse<Comment>> => {
    try {
        const response = await apiClient.put(`/comments/${commentId}`, { content, updatedBy })
        return response.data
    } catch (error: any) {
        console.error('Lỗi cập nhật bình luận:', error.response?.data || error.message)
        throw error
    }
}