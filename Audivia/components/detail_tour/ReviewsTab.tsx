import { View, Text, Image, TouchableOpacity, Modal, TextInput, Alert } from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import { styles } from "@/styles/tour_detail.styles"
import { COLORS } from "@/constants/theme"
import type { Review, Tour } from "@/models"
import { useEffect, useState } from "react"
import { getReviewTourByTourId, deleteReviewTour, updateReviewTour } from "@/services/review_tour"
import { useLocalSearchParams } from "expo-router"
import { useUser } from "@/hooks/useUser"

interface ReviewsTabProps {
  tour: Tour | undefined
  onReviewChange: () => void
}

export const ReviewsTab = ({ tour, onReviewChange }: ReviewsTabProps) => {
  const { tourId } = useLocalSearchParams()
  const [reviews, setReviews] = useState<Review[]>([])
  const { user } = useUser()
  const [isModalVisible, setModalVisible] = useState(false)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [editedRating, setEditedRating] = useState(0)
  const [editedContent, setEditedContent] = useState("")

  const fetchReviews = async () => {
    try {
      const response = await getReviewTourByTourId(tourId as string)
      if (!Array.isArray(response)) {
        console.error("Invalid response format:", response)
        setReviews([])
        return
      }
      setReviews(response)
    } catch (error) {
      console.error("Error fetching reviews:", error)
      setReviews([])
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [tourId])

  const handleOpenModal = (review: Review) => {
    setSelectedReview(review)
    setEditedRating(review.rating)
    setEditedContent(review.content)
    setModalVisible(true)
  }

  const handleUpdateReview = async () => {
    if (!selectedReview) return

    try {
      await updateReviewTour(selectedReview.id, {
        rating: editedRating,
        content: editedContent,
      })
      await fetchReviews() // Refetch reviews to get updated data
      onReviewChange() // Notify parent to refetch tour details
      setModalVisible(false)
      setSelectedReview(null)
    } catch (error) {
      console.error("Error updating review:", error)
    }
  }

  const handleDeleteReview = (reviewId: string) => {
    Alert.alert(
      "Xóa đánh giá",
      "Bạn có chắc chắn muốn xóa đánh giá này không?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          onPress: async () => {
            try {
              await deleteReviewTour(reviewId)
              await fetchReviews() // Refetch reviews
              onReviewChange() // Notify parent to refetch tour details
            } catch (error) {
              console.error("Error deleting review:", error)
            }
          },
          style: "destructive",
        },
      ]
    )
  }

  const renderReviewItem = (review: Review) => (
    <View style={styles.reviewItem} key={review.id}>
      <View style={styles.reviewHeader}>
        <Image
          source={{ uri: review?.avatarUrl || "https://randomuser.me/api/portraits/lego/1.jpg" }}
          style={styles.reviewerAvatar}
        />
        <View style={styles.reviewerInfo}>
          <Text style={styles.reviewerName}>{review?.userName || "Anonymous"}</Text>
          <Text style={[styles.reviewerName, { fontSize: 14, color: COLORS.grey }]}>{review?.title}</Text>
          <View style={styles.reviewRating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <FontAwesome
                key={star}
                name={star <= review.rating ? "star" : "star-o"}
                size={14}
                color={COLORS.orange}
                style={styles.reviewStarIcon}
              />
            ))}
          </View>
        </View>
        <Text style={styles.reviewTime}>
          {new Date(review.createdAt).toLocaleDateString()}
        </Text>
      </View>

      <Text style={styles.reviewComment}>{review.content}</Text>

      {user?.id === review.createdBy && (
        <View style={styles.reviewActions}>
          <TouchableOpacity onPress={() => handleOpenModal(review)} style={styles.actionButton}>
            <Text style={styles.actionText}>Sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteReview(review.id)} style={[styles.actionButton, styles.deleteButton]}>
            <Text style={[styles.actionText, styles.deleteText]}>Xóa</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )

  return (
    <View style={styles.reviewsContainer}>
      <View style={styles.ratingOverview}>
        <Text style={styles.ratingBig}>{tour?.avgRating.toFixed(1)}</Text>
        <View style={styles.ratingStarsContainer}>
          {[1, 2, 3, 4, 5].map((star, index) => (
            <FontAwesome
              key={index}
              name={
                !tour?.avgRating
                  ? "star-o"
                  : star <= Math.floor(tour.avgRating)
                    ? "star"
                    : star <= tour.avgRating
                      ? "star-half-o"
                      : "star-o"
              }
              size={16}
              color={COLORS.orange}
              style={styles.starIcon}
            />
          ))}
        </View>
        <Text style={styles.ratingCount}>Dựa trên {tour?.ratingCount} đánh giá</Text>
      </View>

      <View style={styles.reviewsHeader}>
        <Text style={styles.sectionTitle}>Đánh giá Tour</Text>
      </View>

      {reviews.map((review) => renderReviewItem(review))}

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chỉnh sửa đánh giá</Text>
            <View style={styles.ratingStarsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setEditedRating(star)}>
                  <FontAwesome
                    name={star <= editedRating ? "star" : "star-o"}
                    size={30}
                    color={COLORS.orange}
                    style={styles.starIcon}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.modalTextInput}
              value={editedContent}
              onChangeText={setEditedContent}
              placeholder="Viết đánh giá của bạn..."
              multiline
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleUpdateReview}
              >
                <Text style={styles.saveButtonText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
} 