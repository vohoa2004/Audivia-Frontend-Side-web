import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { styles } from "@/styles/tour_detail.styles"
import { COLORS } from "@/constants/theme"
import type { Tour } from "@/models"
import { router } from "expo-router"

interface BeforeTabProps {
  tour: Tour | undefined
}

const renderRouteItem = (item: any, index: number) => (
  <View style={styles.routeItem} key={index}>
    <View style={styles.routeNumberContainer}>
      <Text style={styles.routeNumber}>{index + 1}</Text>
    </View>
    <View style={styles.routeContent}>
      <Text style={styles.routeName}>{item.title}</Text>
      <Text style={styles.routeDescription}>{item.description || "Không có mô tả"}</Text>
    </View>
  </View>
)

export const BeforeTab = ({ tour }: BeforeTabProps) => {

  const handleViewMap = () => {
    if (tour?.id) {
      if (tour.useCustomMap) {
        router.push(`/(screens)/tour_custom_map?tourId=${tour.id}`)
      } else {
        router.push(`/(screens)/tour_map?tourId=${tour.id}`)
      }
    }
  }

  return (
    <View style={styles.beforeContainer}>
      <Text style={styles.sectionTitle}>Tổng quan Lộ trình</Text>

      <View style={styles.startLocationContainer}>
        <View style={styles.startLocationIcon}>
          <Ionicons name="flag" size={20} color="#fff" />
        </View>
        <View>
          <Text style={styles.startLocationTitle}>Điểm bắt đầu</Text>
          <Text style={styles.startLocationText}>{tour?.checkpoints?.[0]?.title || "Điểm xuất phát"}</Text>
        </View>
      </View>

      <View>
        {tour?.checkpoints?.map((checkpoint, index) => renderRouteItem(checkpoint, index))}
      </View>

      <View style={styles.startLocationContainer}>
        <View style={styles.startLocationIcon}>
          <Ionicons name="flag" size={20} color={COLORS.red} />
        </View>
        <View>
          <Text style={styles.startLocationTitle}>Điểm kết thúc</Text>
          <Text style={styles.startLocationText}>
            {tour?.checkpoints?.[tour?.checkpoints?.length - 1]?.title || "Điểm kết thúc"}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.viewMapButton} onPress={handleViewMap}>
        <Ionicons name="map" size={18} color={COLORS.primary} />
        <Text style={styles.viewMapText}>Xem Bản đồ</Text>
      </TouchableOpacity>
    </View>
  )
} 