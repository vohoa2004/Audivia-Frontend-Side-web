import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "@/constants/theme"
import styles from "@/styles/profile.styles"
import { User } from "@/models"

interface ProfileAboutProps {
  user: User
  isOwnProfile: boolean
  onEditProfile: () => void
}

export const ProfileAbout = ({ user, isOwnProfile, onEditProfile }: ProfileAboutProps) => {
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
        </View>

        <View style={styles.aboutItem}>
          <Ionicons name="call-outline" size={20} color={COLORS.primary} style={styles.aboutIcon} />
          <View>
            <Text style={styles.aboutLabel}>Số điện thoại</Text>
            <Text style={styles.aboutText}>{user?.phone}</Text>
          </View>
        </View>

        <View style={styles.aboutItem}>
          <Ionicons name="bonfire-outline" size={20} color={COLORS.primary} style={styles.aboutIcon} />
          <View>
            <Text style={styles.aboutLabel}>Bio</Text>
            <Text style={styles.aboutText}>{user?.bio}</Text>
          </View>
        </View>

        <View style={styles.aboutItem}>
          <Ionicons name="calendar-outline" size={20} color={COLORS.primary} style={styles.aboutIcon} />
          <View>
            <Text style={styles.aboutLabel}>Ngày sinh</Text>
            <Text style={styles.aboutText}>
              {user?.birthDay ? new Date(user.birthDay).toLocaleDateString() : "Chưa cập nhật"}
            </Text>
          </View>
        </View>

        <View style={styles.aboutItem}>
          <Ionicons name="body-outline" size={20} color={COLORS.primary} style={styles.aboutIcon} />
          <View>
            <Text style={styles.aboutLabel}>Giới tính</Text>
            <Text style={styles.aboutText}>
              {user?.gender === false ? "Nam" : user?.gender === true ? "Nữ" : "Chưa cập nhật"}
            </Text>
          </View>
        </View>

        <View style={styles.aboutItem}>
          <Ionicons name="briefcase-outline" size={20} color={COLORS.primary} style={styles.aboutIcon} />
          <View>
            <Text style={styles.aboutLabel}>Nghề nghiệp</Text>
            <Text style={styles.aboutText}>{user?.job || "Chưa cập nhật"}</Text>
          </View>
        </View>

        <View style={styles.aboutItem}>
          <Ionicons name="earth-outline" size={20} color={COLORS.primary} style={styles.aboutIcon} />
          <View>
            <Text style={styles.aboutLabel}>Quốc gia</Text>
            <Text style={styles.aboutText}>{user?.country || "Chưa cập nhật"}</Text>
          </View>
        </View>

        {isOwnProfile && (
          <TouchableOpacity style={styles.editProfileButton} onPress={onEditProfile}>
            <Text style={styles.editProfileButtonText}>Chỉnh sửa thông tin</Text>
          </TouchableOpacity>
        )}

      </View>
    </View>
  )
} 