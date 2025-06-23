import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SuggestedTours } from '@/components/home/SuggestedTours';
import { Tour } from '@/models';
import { getSuggestedTours, getTourById } from '@/services/tour';
// import UserLocationMap from '@/components/common/UserLocationMap';
import { COLORS } from '@/constants/theme';
import { router, useLocalSearchParams } from 'expo-router';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { useUser } from '@/hooks/useUser';
import { LinearGradient } from 'expo-linear-gradient';

const FinishTourScreen = () => {
  const [suggestedTours, setSuggestedTours] = useState<Tour[]>([])
  const [userCoordinates, setUserCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [currentLocationAddress, setCurrentLocationAddress] = useState<string | null>(null);
  const { tourId } = useLocalSearchParams()
  const [hasFetchedTours, setHasFetchedTours] = useState(false);
  const [tourInfor, setTourInfor] = useState<Tour | undefined>()
  const { stopTracking } = useLocationTracking();
  const { user } = useUser();

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        const response = await getTourById(tourId as string)
        setTourInfor(response.response)
      } catch (error) {
        console.error('Error fetching tour:', error)
      }
    }

    fetchTourData()

    if (userCoordinates && !hasFetchedTours) {
      getSuggestedTours(
        user?.id,
        userCoordinates.longitude,
        userCoordinates.latitude,
        3 // 3km radius
      ).then((res) => {
        setSuggestedTours(res.response.data)
        setHasFetchedTours(true);
      }).catch((error) => {
        console.error('Error fetching suggested tours:', error);
      });
    }
  }, [userCoordinates, hasFetchedTours, user?.id]);

  const handleLocationChange = (address: string | null, coordinates?: { latitude: number; longitude: number } | null) => {
    setCurrentLocationAddress(address);
    if (coordinates && !userCoordinates) {
      setUserCoordinates(coordinates);
    }
  };

  const handleReview = () => {
    router.push(`/(screens)/review_end_tour?tourId=${tourId}`)
  }

  const handleGoHome = async () => {
    console.log("Navigating home, stopping location tracking...");
    await stopTracking();
    console.log("Location tracking stopped.");
    router.navigate('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity> */}
        <Text style={styles.headerTitle}>Kết thúc tour</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Main Image */}
        <Image
          source={{ uri: tourInfor?.thumbnailUrl }}
          style={styles.mainImage}
          resizeMode="cover"
        />

        {/* Tour Card */}
        <View style={styles.tourCard}>
          <Text style={styles.tourName}>{tourInfor?.title}</Text>

          <Text style={styles.congratsText}>
            Xin chúc mừng! Bạn vừa hoàn thành chuyến tham quan bằng âm thanh! Chúng tôi hy vọng bạn đã có nhiều trải nghiệm ấn tượng trong chuyến đi này!
          </Text>

          {/* Rating */}
          <TouchableOpacity onPress={handleReview}>
            <View style={styles.ratingSection}>
              <Text style={styles.rateText}>Đánh giá trải nghiệm của bạn</Text>
              <View style={styles.starsContainer}>
                <Ionicons name="star" size={24} color={COLORS.grey} />
                <Ionicons name="star" size={24} color={COLORS.grey} />
                <Ionicons name="star" size={24} color={COLORS.grey} />
                <Ionicons name="star" size={24} color={COLORS.grey} />
                <Ionicons name="star" size={24} color={COLORS.grey} />
              </View>
              <Text style={styles.ratingText}>5 trên 5</Text>
            </View>

          </TouchableOpacity>
          {/* Funny Quiz Button */}
          <TouchableOpacity style={styles.quizButton}>
            <Text style={styles.quizButtonText}>Câu đố vui</Text>
          </TouchableOpacity>


          <TouchableOpacity onPress={handleGoHome} activeOpacity={0.7}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.purpleGradient]}  // Thay bằng màu gradient bạn muốn
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}  // Style cho nút
            >
              <Text style={[styles.buttonText, { backgroundColor: 'transparent' }]}>
                Quay về trang chủ
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Discover More Tours */}
          <View>
            {/* Hidden UserLocationMap to get location */}
            {/* <View style={{ height: 0, width: 0, opacity: 0 }}>
              <UserLocationMap
                width={Dimensions.get('window').width}
                onLocationChange={handleLocationChange}
              />
            </View> */}
            <SuggestedTours suggestedTours={suggestedTours} />
          </View>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0E0E0',
  },
  header: {
    height: 56,
    backgroundColor: '#00A9CE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  mainImage: {
    width: '100%',
    height: 180,
  },
  tourCard: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    padding: 16,
    paddingTop: 24,
  },
  tourName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00A9CE',
    marginBottom: 12,
  },
  congratsText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  journeyText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  ratingSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 8
  },
  rateText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  quizButton: {
    backgroundColor: '#00CED1',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  quizButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  homeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  homeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
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
  }
});

export default FinishTourScreen;