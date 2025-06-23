import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from "react-native"
import styles from "@/styles/menu.styles"
import { useAuth } from "@/contexts/AuthContext"
import { MenuHeader } from "@/components/menu/MenuHeader"
import { MenuAccount } from "@/components/menu/MenuAccount"
import { MenuPreferences } from "@/components/menu/MenuPreferences"
import { LinearGradient } from "expo-linear-gradient"
import { COLORS } from "@/constants/theme"

export default function MenuScreen() {
  const { logout } = useAuth()

  const handleSignOut = async () => {
    await logout()
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <MenuHeader />
        <MenuAccount />
        <MenuPreferences />

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.purpleGradient]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.signOutButton}
            >
              <Text style={styles.signOutText}>Đăng xuất</Text>
            </LinearGradient>
          </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

