import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import styles from "@/styles/menu.styles"
import { COLORS } from "@/constants/theme"
import { router } from "expo-router"

export const MenuPreferences = () => {
  return (
    <View style={styles.section}>
      <View style={styles.menuGroup}>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(screens)/character_selection')}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="settings-outline" size={22} color={COLORS.primary} />
          </View>
          <Text style={styles.menuText}>Cài đặt tùy chọn giọng nói </Text>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" style={styles.arrowIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="moon-outline" size={22} color={COLORS.primary} />
          </View>
          <Text style={styles.menuText}>Về Audivia</Text>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>
    </View>
  )
} 