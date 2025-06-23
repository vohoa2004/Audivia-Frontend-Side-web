import { View, Image, TouchableOpacity } from "react-native"
import styles from "@/styles/profile.styles"

interface ProfileCoverProps {
  coverPhoto?: string
  avatarUrl?: string
  defaultAvatar: string
  onAvatarPress: () => void
  isOwnProfile: boolean
}

export const ProfileCover = ({
  coverPhoto,
  avatarUrl,
  defaultAvatar,
  onAvatarPress,
  isOwnProfile
}: ProfileCoverProps) => {
  return (
    <View style={styles.coverPhotoContainer}>
      <Image source={{ uri: coverPhoto }} style={styles.coverPhoto} />
      <TouchableOpacity 
        style={styles.profileAvatarContainer} 
        onPress={onAvatarPress}
        disabled={!isOwnProfile}
      >
        <Image source={{ uri: avatarUrl || defaultAvatar }} style={styles.profileAvatar} />
      </TouchableOpacity>
    </View>
  )
} 