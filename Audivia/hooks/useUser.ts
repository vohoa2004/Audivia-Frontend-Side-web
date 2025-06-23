import { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getUserInfo } from '@/services/user'
import { User } from '@/models'

interface JwtPayload {
  userId: string;
  email: string;
  userName: string;
}

export const useUser = () => {
  const [user, setUser] = useState<User>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken')
        if (token) {
          const decodedToken = jwtDecode<JwtPayload>(token)
          const response = await getUserInfo(decodedToken.userId)
          setUser(response.response)
        }
      } catch (err) {
        setError('Lỗi khi lấy thông tin người dùng')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, loading, error }
} 