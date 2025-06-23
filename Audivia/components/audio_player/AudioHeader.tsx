import { View, TouchableOpacity, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import styles from "@/styles/audio_player"
import { useRoute } from "@react-navigation/native"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { COLORS } from "@/constants/theme"

interface AudioHeaderProps {
  checkpointId: string
  onBackPress?: () => void
  onMenuPress?: () => void
}

export default function AudioHeader({checkpointId, onBackPress, onMenuPress }: AudioHeaderProps) {
  
  const router = useRouter()

  const handleDetail = () => {
    router.push(`/tour_checkpoint_detail?checkpointId=${checkpointId}`);
  }
  
  
  
  
  return (
    <LinearGradient
    colors={[COLORS.primary, COLORS.purpleGradient]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.header} // vẫn dùng style như cũ, bỏ backgroundColor
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.headerText}>Audio Player</Text>
        </View>
        <TouchableOpacity style={styles.menuButton} onPress={handleDetail}>
          <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  )
} 