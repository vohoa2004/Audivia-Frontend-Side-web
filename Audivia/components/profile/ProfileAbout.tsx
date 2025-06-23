import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "@/constants/theme"
import styles from "@/styles/profile.styles"
import { User } from "@/models"

interface ProfileAboutProps {
  user: User
  isOwnProfile: boolean
}

export const ProfileAbout = ({ user, isOwnProfile }: ProfileAboutProps) => {
  return (
    <View style={styles.aboutContainer}>
      <View style={styles.aboutCard}>
        <Text style={styles.aboutTitle}>Thông tin cá nhân</Text>

        <View style={styles.aboutItem}>
          <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles.aboutIcon} />
          <View>
            <Text style={styles.aboutLabel}>Username</Text>
            <Text style={styles.aboutText}>{user?.userName}</Text>
          </View>
          {isOwnProfile && (
            <TouchableOpacity style={styles.aboutEditButton}>
              <Ionicons name="pencil-outline" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.aboutItem}>
          <Ionicons name="mail-outline" size={20} color={COLORS.primary} style={styles.aboutIcon} />
          <View>
            <Text style={styles.aboutLabel}>Email</Text>
            <Text style={styles.aboutText}>{user?.email}</Text>
          </View>
        </View>

        <View style={styles.aboutItem}>
          <Ionicons name="person-circle-outline" size={20} color={COLORS.primary} style={styles.aboutIcon} />
          <View>
            <Text style={styles.aboutLabel}>Full Name</Text>
            <Text style={styles.aboutText}>{user?.fullName}</Text>
          </View>
          {isOwnProfile && (
            <TouchableOpacity style={styles.aboutEditButton}>
              <Ionicons name="pencil-outline" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.aboutItem}>
          <Ionicons name="call-outline" size={20} color={COLORS.primary} style={styles.aboutIcon} />
          <View>
            <Text style={styles.aboutLabel}>Số điện thoại</Text>
            <Text style={styles.aboutText}>{user?.phone}</Text>
          </View>
          {isOwnProfile && (
            <TouchableOpacity style={styles.aboutEditButton}>
              <Ionicons name="pencil-outline" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.aboutItem}>
          <Ionicons name="bonfire-outline" size={20} color={COLORS.primary} style={styles.aboutIcon} />
          <View>
            <Text style={styles.aboutLabel}>Bio</Text>
            <Text style={styles.aboutText}>{user?.bio}</Text>
          </View>
          {isOwnProfile && (
            <TouchableOpacity style={styles.aboutEditButton}>
              <Ionicons name="pencil-outline" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  )
} 