import { View, Text, Image, ScrollView } from "react-native"
import { Ionicons, FontAwesome } from "@expo/vector-icons"
import { styles } from "@/styles/tour_detail.styles"
import { COLORS } from "@/constants/theme"
import type { Checkpoint, Tour } from "@/models"

interface AboutTabProps {
  tour: Tour | undefined
}

const renderDestinationItem = (destination: any, index: number) => (
  <View key={destination.id} style={styles.destinationItem}>
    <Image
      source={{
        uri:
          destination.images[0].imageUrl ||
          "https://maps.googleapis.com/maps/api/staticmap?center=10.8700,106.8030&zoom=14&size=600x300&maptype=roadmap&markers=color:red%7C10.8700,106.8030&key=YOUR_API_KEY",
      }}
      style={styles.destinationImage}
    />
    <Text style={styles.destinationName}>{destination.title}</Text>
    <View style={styles.destinationBadge}>
      <Text style={styles.destinationBadgeText}>{index + 1}</Text>
    </View>
  </View>
)

export const AboutTab = ({ tour }: AboutTabProps) => {
  return (
    <View>
      {/* Tour Title */}
      <View style={styles.tourTitleContainer}>
        <Text style={styles.tourName}>{tour?.title}</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color={COLORS.primary} />
          <Text style={styles.locationText}>{tour?.location}</Text>
        </View>

        <View style={styles.ratingContainer}>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <FontAwesome
                key={star}
                name={
                  star <= Math.floor(tour?.avgRating || 0)
                    ? "star"
                    : star <= (tour?.avgRating || 0)
                      ? "star-half-o"
                      : "star-o"
                }
                size={16}
                color={COLORS.orange}
                style={styles.starIcon}
              />
            ))}
          </View>
          <Text style={styles.ratingText}>{tour?.avgRating.toFixed(1)}</Text>
        </View>
      </View>

      {/* Tour Overview */}
      <View style={styles.overviewContainer}>
        <Text style={styles.sectionTitle}>Tổng quan Tour</Text>

        <View style={styles.overviewGrid}>
          <View style={styles.overviewItem}>
            <Ionicons name="time-outline" size={20} color={COLORS.primary} />
            <View style={styles.overviewItemTextContainer}>
              <Text style={styles.overviewItemLabel}>Thời lượng</Text>
              <Text style={styles.overviewItemValue}>{tour?.duration} giờ</Text>
            </View>
          </View>

          <View style={styles.overviewItem}>
            <Ionicons name="location" size={20} color={COLORS.primary} />
            <View style={styles.overviewItemTextContainer}>
              <Text style={styles.overviewItemLabel}>Tổng điểm đến</Text>
              <Text style={styles.overviewItemValue}>{tour?.checkpoints?.length || 0} nơi</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.sectionTitle}>Mô tả</Text>
        <Text style={styles.descriptionText}>{tour?.description}</Text>
      </View>

      {/* Destinations */}
      <View style={styles.destinationsContainer}>
        <Text style={styles.sectionTitle}>Điểm đến</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.destinationsScrollContent}
        >
          {tour?.checkpoints?.map((destination: Checkpoint, index: number) =>
            renderDestinationItem(destination, index),
          )}
        </ScrollView>
      </View>
    </View>
  )
} 