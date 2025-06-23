import { View, Text, Image, TouchableOpacity, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { COLORS } from "@/constants/theme"
import styles from "@/styles/save_tour.styles"
import { SaveTour } from "@/models"
import { deleteSaveTour } from "@/services/save_tour"
import { useState } from "react"

interface SaveTourCardProps {
  item: SaveTour
  onDelete: (tourId: string) => void
}

export const SaveTourCard = ({ item, onDelete }: SaveTourCardProps) => {
  const router = useRouter()
  const [showPostOptions, setShowPostOptions] = useState(false)

  const navigateToPlanTour = (tourId: string) => {
    router.push(`/plan_tour?id=${tourId}`)
  }

  const handleDeleteSaveTour = async (tourId: string) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa tour yêu thích này?',
      [
        {
          text: 'Hủy',
          style: 'cancel'
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSaveTour(tourId)
              onDelete(tourId)
              setShowPostOptions(false)
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể xóa bài viết. Vui lòng thử lại.')
            }
          }
        }
      ]
    )
  }

  return (
    <View style={styles.tourCard}>
      <View style={{ alignItems: 'flex-end', marginEnd: 10, marginTop: 10 }}>
        <TouchableOpacity onPress={() => setShowPostOptions(!showPostOptions)}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
        </TouchableOpacity>
      </View>
      {showPostOptions && (
        <View style={styles.postOptions}>
          <TouchableOpacity
            style={styles.postOption}
            onPress={() => handleDeleteSaveTour(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color={COLORS.red} />
            <Text style={[styles.postOptionText, { color: COLORS.red }]}>Xóa</Text>
          </TouchableOpacity>
        </View>
      )}
      <Image source={{ uri: item.tour.thumbnailUrl }} style={styles.tourImage} />
      <View style={styles.tourContent}>
        <View style={styles.tourHeader}>
          <View>
            <Text style={styles.tourName}>{item.tour.title}</Text>
            <Text style={styles.tourLocation}>
              <Ionicons name="location-outline" size={14} color={COLORS.grey} /> {item.tour.location}
            </Text>
          </View>
          <View style={styles.tourRating}>
            <Ionicons name="star" size={16} color={COLORS.orange} />
            <Text style={styles.ratingText}>{item.tour.avgRating.toFixed(1)}</Text>
          </View>
        </View>

        <View style={styles.tourFooter}>
          <Text style={styles.savedTime}>Đã lưu {item.timeAgo}</Text>
          <View style={styles.tourActions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigateToPlanTour(item.id)}>
              <View style={[styles.actionButtonInner, styles.scheduleButton]}>
                <Ionicons name="calendar-outline" size={18} color={COLORS.light} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionButtonInner, styles.favoriteButton]}>
                <Ionicons name="heart" size={18} color={COLORS.light} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
} 