import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "@/constants/theme"
import styles from "@/styles/profile.styles"
import { User } from "@/models"

interface ProfileInfoProps {
  user: User
  isOwnProfile: boolean
  status: string
  onFollow: () => void
  onUnfollow: () => void
  onMessage: () => void
}

export const ProfileInfo = ({
  user,
  isOwnProfile,
  status,
  onFollow,
  onUnfollow,
  onMessage
}: ProfileInfoProps) => {
  return (
    <View style={styles.profileInfo}>
      <Text style={styles.profileName}>{user?.userName}</Text>
      <Text style={styles.profileBio}>{user?.bio}</Text>

      {isOwnProfile ? (
        <View style={styles.socialStats}>
          <View style={styles.socialStat}>
            <Text style={styles.socialStatNumber}>{user?.friends}</Text>
            <Text style={styles.socialStatLabel}>Bạn bè</Text>
          </View>
          <View style={styles.socialStatDivider} />
          <View style={styles.socialStat}>
            <Text style={styles.socialStatNumber}>{user?.followers}</Text>
            <Text style={styles.socialStatLabel}>Người theo dõi</Text>
          </View>
        </View>
      ) : (
        <View style={styles.profileActions}>
          {status === "Friends" ? (
            <TouchableOpacity style={[styles.profileActionButton, styles.primaryActionButton]} onPress={onUnfollow}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
              <Text style={styles.primaryActionText}>Bạn bè</Text>
            </TouchableOpacity>
          ): status === "Following" ? (
            <TouchableOpacity style={[styles.profileActionButton, styles.primaryActionButton]} onPress={onUnfollow}>
              <Ionicons name="checkmark-outline" size={20} color="#fff" />
              <Text style={styles.primaryActionText}>Đang theo dõi</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.profileActionButton, styles.primaryActionButton]} onPress={onFollow}>
              <Ionicons name="person-add-outline" size={20} color="#fff" />
              <Text style={styles.primaryActionText}>Thêm bạn</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={[styles.profileActionButton, styles.secondaryActionButton]}
            onPress={onMessage}
          >
            <Ionicons name="chatbubble-outline" size={20} color={COLORS.primary} />
            <Text style={[styles.secondaryActionText, { color: COLORS.primary }]}>Nhắn tin</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
} 