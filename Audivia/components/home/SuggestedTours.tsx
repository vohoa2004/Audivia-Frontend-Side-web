import { View, Text, TouchableOpacity, Image, FlatList, Dimensions, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import styles from '@/styles/home.styles';
import { Tour } from '@/models';
import { router, useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { createSaveTour } from '@/services/save_tour';
import { useUser } from '@/hooks/useUser';
import { LinearGradient } from 'expo-linear-gradient';

interface SuggestedToursProps {
  suggestedTours: Tour[];
  onRefresh?: () => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH * 0.43;
const CARD_MARGIN = 8;

export const SuggestedTours = ({ suggestedTours, onRefresh }: SuggestedToursProps) => {
  const { user } = useUser();
  const router = useRouter();

  if (!suggestedTours || suggestedTours.length === 0) {
    return null;
  }

  const navigateToTourDetail = (tourId: string) => {
    router.push(`/(screens)/detail_tour?tourId=${tourId}`);
  };

  const handleSaveTour = async (tourId: string) => {
    try {
      await createSaveTour(user?.id as string, tourId);
      Alert.alert("Đã lưu tour", "Tour đã được thêm vào danh sách yêu thích.");
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu tour.");
    }
  };

  const renderTourItem = ({ item, index }: { item: Tour, index: number }) => (
    <TouchableOpacity
      style={[styles.tourCard, {
        width: CARD_WIDTH,
        marginLeft: index === 0 ? CARD_MARGIN : CARD_MARGIN / 2,
        marginRight: CARD_MARGIN,
        overflow: 'hidden',
        marginBottom: 10,
      }]}
      onPress={() => navigateToTourDetail(item.id)}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item.thumbnailUrl }}
        style={[styles.tourImage, { height: CARD_WIDTH * 0.7 }]}
        resizeMode="cover"
      />


      {/* Price Tag */}
      <View style={{
        position: 'absolute',
        left: 0,
        top: 15,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
      }}>
        <Text style={{
          color: 'white',
          fontSize: 16,
          fontWeight: '600',
        }}>{item.price === 0 ? "Miễn phí" : `${item.price.toLocaleString('vi-VN')} VND`}</Text>
      </View>

      <View style={{ padding: 12 }}>
        <Text style={styles.tourName} numberOfLines={1}>{item.title}</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text style={{ fontSize: 16, color: '#666', marginLeft: 4 }} numberOfLines={1}>{item.location}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <Ionicons name="time-outline" size={14} color="#666" />
          <Text style={{ fontSize: 16, color: '#666', marginLeft: 4 }}>{item.duration} phút</Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesome name="star" size={14} color={COLORS.orange} />
            <Text style={{ fontSize: 16, marginLeft: 4, fontWeight: '500', flexShrink: 1, minWidth: 90, }}>
              {item.avgRating.toFixed(1)}{`(${item.ratingCount} đánh giá)`}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => handleSaveTour(item.id)}
          >
            <Ionicons name="heart" size={20} color={COLORS.light} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity >
  );

  return (
    <View style={styles.toursSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Địa điểm được đề xuất</Text>
      </View>

      <Text style={styles.tourSubtitle}>Dựa trên sở thích và vị trí của bạn</Text>

      <FlatList
        data={suggestedTours}
        renderItem={renderTourItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 10 }}
        snapToInterval={CARD_WIDTH + CARD_MARGIN}
        decelerationRate="fast"
      />
    </View>
  );
}; 