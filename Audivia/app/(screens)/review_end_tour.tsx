import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { writeReviewTour, getReviewTourByTourIdAndUserId, updateReviewTour } from '@/services/review_tour';
import { useUser } from '@/hooks/useUser';
import { getTourById } from '@/services/tour';
import { formatMoney } from '@/utils/formatter';

import { COLORS } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface TourInfo {
    thumbnailUrl: string;
    title: string;
    duration: number;
    price: number;
}

const WriteReviewScreen = () => {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [reviewId, setReviewId] = useState<string | null>(null);
  const { tourId } = useLocalSearchParams()
  const { user } = useUser()
  const [tourInfor, setTourInfor] = useState<TourInfo | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!tourId || !user?.id) return;
      try {
        const [tourResponse, reviewResponse] = await Promise.all([
          getTourById(tourId as string),
          getReviewTourByTourIdAndUserId(tourId as string, user.id)
        ]);
        
        if (tourResponse.success) {
            setTourInfor(tourResponse.response);
        }

        if (reviewResponse.success && reviewResponse.response) {
          const existingReview = reviewResponse.response;
          setRating(existingReview.rating);
          setTitle(existingReview.title);
          setReview(existingReview.content);
          setReviewId(existingReview.id);
        }

      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, [tourId, user?.id]);

  const handleSubmitReview = useCallback(async () => {
    if (!tourId || !user?.id) {
      Alert.alert('Lỗi', 'Thông tin tour hoặc người dùng bị thiếu.');
      return;
    }
    
    try {
      if (reviewId) {
        await updateReviewTour(reviewId, { rating, content: review, title });
        Alert.alert('Thành công', 'Đánh giá của bạn đã được cập nhật.');
      } else {
        await writeReviewTour(title, rating, review, tourId as string, user.id);
        Alert.alert('Thành công', 'Cảm ơn bạn đã gửi đánh giá!');
      }
      router.back();
    } catch (error: any) {
        if (error.response?.data?.message?.includes("already reviewed")) {
            Alert.alert('Đã đánh giá', 'Bạn đã gửi đánh giá cho tour này rồi. Vui lòng quay lại để chỉnh sửa.');
        } else {
            Alert.alert('Lỗi', 'Đã có lỗi xảy ra. Vui lòng thử lại.');
        }
      console.error('Error submitting review:', error.response?.data || error.message);
    }
  }, [tourId, user?.id, reviewId, rating, title, review]);

  return (
    <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{reviewId ? 'Chỉnh sửa đánh giá' : 'Viết đánh giá'}</Text>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {tourInfor && (
            <View style={styles.tourInfo}>
            <Image
                source={{ uri: tourInfor.thumbnailUrl }}
                style={styles.tourImage}
            />
            <View style={styles.tourDetails}>
                <Text style={styles.tourName}>{tourInfor.title}</Text>
                <Text style={styles.tourDuration}>{tourInfor.duration} giờ</Text>
                <Text style={styles.tourCompletion}>{tourInfor.price} VND</Text>
            </View>
            </View>
        )}

        <View style={styles.ratingSection}>
          <Text style={styles.ratingTitle}>Trải nghiệm của bạn như thế nào?</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
              >
                <Ionicons
                  name={star <= rating ? "star" : "star-outline"}
                  size={32}
                  color="#FFD700"
                  style={styles.starIcon}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.ratingText}>{rating} trên 5 sao</Text>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Tiêu đề</Text>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Một nơi tuyệt vời !"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Nội dung đánh giá</Text>
          <TextInput
            style={styles.reviewInput}
            value={review}
            onChangeText={setReview}
            placeholder="Hãy chia sẻ những trải nghiệm và cảm nhận của bạn về chuyến đi này nhé..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitReview}
        >
            <LinearGradient
              colors={[COLORS.primary, COLORS.purpleGradient]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
              >
                 <Text style={styles.buttonText}>{reviewId ? 'Cập nhật đánh giá' : 'Đăng đánh giá'}</Text>
            </LinearGradient>
         
        </TouchableOpacity>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  tourInfo: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tourImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  tourDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  tourName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tourDuration: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  tourCompletion: {
    fontSize: 14,
    color: '#666',
  },
  ratingSection: {
    padding: 16,
    alignItems: 'center',
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  starIcon: {
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  inputSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 120,
    textAlignVertical: 'top',
  },
  photoSection: {
    margin: 16,
    marginTop: 0,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  photoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  photoText: {
    fontSize: 14,
    marginLeft: 8,
    color: '#666',
  },
  photoLimit: {
    fontSize: 12,
    color: '#999',
  },
  submitButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
    button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WriteReviewScreen;