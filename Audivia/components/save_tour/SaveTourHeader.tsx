import { View, Text, Image, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { COLORS } from "@/constants/theme"
import styles from "@/styles/save_tour.styles"
import { useUser } from "@/hooks/useUser"
import { NotificationButton } from "@/components/common/NotificationButton"

export const SaveTourHeader = () => {
  const router = useRouter()
  const { user } = useUser()

  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Tour Yêu Thích</Text>
      <View style={styles.headerIcons}>
      <View style={styles.icon}>
            <NotificationButton />
      </View>
        <TouchableOpacity onPress={() => router.push('/(screens)/message_inbox')}>
          <Ionicons name="chatbubble-ellipses-outline" size={22} color={COLORS.dark} style={styles.icon} />
        </TouchableOpacity>
        <View style={styles.avatarWrapper}>
          {user?.avatarUrl ? (
            <Image
              source={{ uri: user?.avatarUrl }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="person-circle-outline" size={22} color={COLORS.primary} />
          )}
        </View>
      </View>
    </View>
  )
} 