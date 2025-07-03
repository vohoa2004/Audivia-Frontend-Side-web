import { COLORS } from "@/constants/theme"
import { useUser } from "@/hooks/useUser"
import { Tour } from "@/models"
import { createSaveTour } from "@/services/save_tour"
import { formatMoney } from "@/utils/formatter"
import { FontAwesome, Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface TourItemProps {
  tour: Tour;
  isSavedTour?: boolean;
  onDelete?: (tourId: string) => void;
  onSave?: (tourId: string) => void;
  savedTourId: string
}

export const TourItem = ({ tour, isSavedTour = false, onDelete, onSave, savedTourId }: TourItemProps) => {
  const { user } = useUser()

  const navigateToTourDetail = (tourId: string) => {
    router.push(`/detail_tour?tourId=${tourId}`)
  }

  const handleSaveTour = async (tourId: string) => {
    try {
      await createSaveTour(user?.id as string, tourId)
      Alert.alert("Đã lưu tour", "Tour đã được thêm vào danh sách yêu thích.")
      if (onSave) {
        onSave(tourId)
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu tour.")
    }
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
            if (onDelete) {
              onDelete(tourId);
            }
          }
        }
      ]
    )
  }

  const navigateToPlanDate = (savedTourId: string) => {
    router.push(`/plan_tour?id=${savedTourId}`)
  }

  return (
    <View style={styles.tourList}>
      <TouchableOpacity style={styles.tourCard} onPress={() => navigateToTourDetail(tour.id)}>
        <View>
          {/* Image */}
          <Image source={{ uri: tour.thumbnailUrl || "https://maps.googleapis.com/maps/api/staticmap?center=10.8700,106.8030&zoom=14&size=600x300&maptype=roadmap&markers=color:red%7C10.8700,106.8030&key=YOUR_API_KEY" }} style={styles.tourImage} />
        </View>

        {/* Tour Info */}
        <View style={styles.tourInfo}>
          {isSavedTour ? (
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => handleDeleteSaveTour(tour.id)}
            >
              <Ionicons name="trash-outline" size={20} color={COLORS.red} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.favoriteButton} onPress={() => handleSaveTour(tour.id)}>
              <FontAwesome name="heart" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          )}

          {/* Tour Name */}
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 4, width: 200 }} numberOfLines={2}>{tour.title}</Text>

          {/* Location */}
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.locationText}>{tour.location}</Text>
          </View>

          {/* Tour Description */}
          <View style={styles.locationContainer}>
            <Ionicons name="information-circle-outline" size={16} color="#666" />
            <Text style={{ fontSize: 16, color: COLORS.grey, marginLeft: 4 }} numberOfLines={2}>{tour.description}</Text>
          </View>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={16} color={COLORS.orange} />
            <Text style={styles.ratingText}>
              {tour.avgRating.toFixed(1)} {`(${tour.ratingCount} đánh giá)`}
            </Text>
          </View>

          {/* Price and Book Button Container */}
          <View style={styles.priceAndBookContainer}>
            {/* Price */}
            <View style={styles.priceTag}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.primary }}>
                {tour.price === 0 ? "Miễn phí" : ` ${formatMoney(tour.price)} Đ`}
              </Text>
            </View>

            {/* Book Button */}
            <TouchableOpacity
              onPress={() => isSavedTour ? navigateToPlanDate(savedTourId) : navigateToTourDetail(tour.id)}
            >
              <View style={styles.bookButton}>
                <LinearGradient
                  colors={[COLORS.primary, COLORS.purpleGradient]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.bookButton}
                >
                  {isSavedTour ? (
                    <Ionicons name="calendar-outline" size={24} color={COLORS.light} />
                  ) : (
                    <Text style={styles.bookButtonText}>Đặt Ngay</Text>
                  )}
                </LinearGradient>
              </View>
            </TouchableOpacity>
          </View>
        </View >
      </TouchableOpacity >
    </View>
  )
}

export const styles = StyleSheet.create({
  tourList: {
    padding: 16,
    paddingTop: 8,
  },
  tourCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingTop: 16
  },
  tourImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 10,
    resizeMode: 'cover'
  },
  favoriteButton: {
    position: "absolute",
    top: 0,
    left: 190,
    backgroundColor: "rgba(131, 81, 138, 0.2)",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  priceTag: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  priceText: {
    fontWeight: "bold",
    color: COLORS.dark,
    fontSize: 18
  },
  tourInfo: {
    flex: 1,
    padding: 5,
  },
  tourName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  tourMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  durationText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
    flexShrink: 1,
    minWidth: 90,
  },
  priceAndBookContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  bookButton: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: "center",
    width: 100,
    marginLeft: 10,
  },
  bookButtonText: {
    color: COLORS.light,
    fontWeight: "bold",
    fontSize: 14,
  },
})
