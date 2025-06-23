import { View, Text, Image, TouchableOpacity } from "react-native"
import styles from "@/styles/menu.styles"
import { router } from "expo-router"
import { useUser } from "@/hooks/useUser"

export const MenuHeader = () => {
  const { user } = useUser()

  const navigateToProfile = () => {
    router.push("/profile")
  }

  return (
    <View style={[styles.header, { alignItems: 'center', justifyContent: 'center' }]}>
      <TouchableOpacity onPress={navigateToProfile}>
        <View style={[styles.headerContent, { alignItems: 'center' }]}>
          <Image
            source={{ uri: user?.avatarUrl }}
            style={styles.avatar}
          />

        </View>
      </TouchableOpacity>
      <View style={[styles.headerTextContainer, { alignItems: 'center' }]}>
        <Text style={styles.userName}>{user?.userName}</Text>
        <Text style={styles.viewProfile}>Xem trang cá nhân của bạn</Text>
      </View>
    </View>
  )
} 