import apiClient from "@/utils/apiClient"

export const getCharacters = async () => {
    try {
        const response = await apiClient.get("/audio-characters")
        return response.data
    } catch (error) {
        console.log('Lỗi không lấy được nhân vật', error)
        throw error
    }
}

