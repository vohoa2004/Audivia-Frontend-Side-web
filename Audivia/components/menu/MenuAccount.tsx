import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import styles from "@/styles/menu.styles"
import { COLORS } from "@/constants/theme"
import { router } from "expo-router"

export const MenuAccount = () => {
  const navigateToWallet = () => {
    router.push("/history_transaction")
  }
  const handlePurchase = () => {
    router.push("/(screens)/tour_purchase")
  }
  const handleHistoryTour = () => {
    router.push("/(screens)/history_tour")
  }
  return (
    <View style={styles.section}>
      <View style={styles.menuGroup}>
        <TouchableOpacity style={styles.menuItem} onPress={handleHistoryTour}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="time-outline" size={22} color={COLORS.primary} />
          </View>
          <Text style={styles.menuText}>Lịch sử tour</Text>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" style={styles.arrowIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handlePurchase}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="cart-outline" size={22} color={COLORS.primary} />
          </View>
          <Text style={styles.menuText}>Lịch sử mua hàng</Text>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" style={styles.arrowIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={navigateToWallet}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="wallet-outline" size={22} color={COLORS.primary} />
          </View>
          <Text style={styles.menuText}>Ví của tôi</Text>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>
    </View>
  )
} 