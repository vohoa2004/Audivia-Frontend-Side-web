import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { styles as tourDetailStyles } from "@/styles/tour_detail.styles"

interface TourHeaderProps {
  tourDetail: any
  onBack: () => void
  onToggleFavorite: () => void
}

export const TourHeader = ({ tourDetail, onBack, onToggleFavorite }: TourHeaderProps) => {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: tourDetail.thumbnailUrl,
        }}
        style={styles.image}
      />

      <View style={tourDetailStyles.headerOverlay}>
        <TouchableOpacity style={tourDetailStyles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={tourDetailStyles.favoriteButton} onPress={onToggleFavorite}>
          <Ionicons name="heart-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
}) 