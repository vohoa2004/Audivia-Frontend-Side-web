import { View, Text, TouchableOpacity, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "@/constants/theme"
import styles from "@/styles/profile.styles"

interface ProfileHeaderProps {
  onBack: () => void
}

export const ProfileHeader = ({ onBack }: ProfileHeaderProps) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Trang cá nhân</Text>
    </View>
  )
} 