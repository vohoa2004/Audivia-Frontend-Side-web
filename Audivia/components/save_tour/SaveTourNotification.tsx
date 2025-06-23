import { View, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "@/constants/theme"
import styles from "@/styles/save_tour.styles"

interface SaveTourNotificationProps {
  savedToursCount: number
}

export const SaveTourNotification = ({ savedToursCount }: SaveTourNotificationProps) => {
  return (
    <View style={styles.notification}>
      <View style={styles.notificationContent}>
        <View style={styles.notificationIconContainer}>
          <Ionicons name="time-outline" size={24} color={COLORS.orange} />
        </View>
        <View style={styles.notificationTextContainer}>
          <Text style={styles.notificationTitle}>Đến lúc khám phá!</Text>
          <Text style={styles.notificationMessage}>
            Bạn có {savedToursCount} tour đã lưu đang chờ được khám phá
          </Text>
        </View>
      </View>
    </View>
  )
} 