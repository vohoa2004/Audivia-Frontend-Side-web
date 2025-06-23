import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "@/constants/theme"
import { router, useLocalSearchParams, useRouter, useFocusEffect } from "expo-router"
import styles from "@/styles/tour_audio.styles"
import { useEffect, useState, useCallback } from "react"
import { CheckpointProgress, Tour, TourProgress } from "@/models"
import { getTourById, getTourAudioByCheckpointId } from "@/services/tour"
import { useUser } from "@/hooks/useUser"
import { checkUserPurchasedTour } from "@/services/historyTransaction"
import { getTourProgress, updateTourProgress } from "@/services/progress"
// import { Audio } from "expo-av"
// import { useLocationTracking } from "@/hooks/useLocationTracking"
import { LinearGradient } from "expo-linear-gradient"

export default function TourAudioScreen() {
  const router = useRouter()
  const { tourId } = useLocalSearchParams()
  const [tour, setTour] = useState<Tour>()
  const { user } = useUser()
  const [characterId, setCharacterId] = useState<string | null>(null)
  const [tourProgress, setTourProgress] = useState<TourProgress>()
  const [audioDurations, setAudioDurations] = useState<{ [key: string]: number }>({})
  // const { startTracking, stopTracking } = useLocationTracking();

  const fetchTourDetails = useCallback(async () => {
    if (tourId) {
      const response = await getTourById(tourId as string)
      setTour(response.response)
    }
  }, [tourId])

  const fetchUserPurchaseInfo = useCallback(async () => {
    if (user?.id && tourId) {
      const response = await checkUserPurchasedTour(user.id, tourId as string)
      setCharacterId(response.audioCharacterId)
    }
  }, [user?.id, tourId])

  const fetchCurrentTourProgress = useCallback(async () => {
    if (!user?.id || !tourId) return
    try {
      const progress = await getTourProgress(user.id, tourId as string)
      setTourProgress(progress.response)
    } catch (error) {
      console.error('Error fetching tour progress:', error)
    }
  }, [user?.id, tourId])

  useEffect(() => {
    fetchTourDetails()
  }, [fetchTourDetails])

  useEffect(() => {
    if (user?.id) {
      fetchUserPurchaseInfo()
      fetchCurrentTourProgress()
    }
  }, [user?.id, fetchUserPurchaseInfo, fetchCurrentTourProgress])

  useFocusEffect(
    useCallback(() => {
      console.log("TourAudioScreen focused: Fetching latest progress and purchase info.");
      // Fetch fresh data when the screen comes into focus
      if (user?.id && tourId) {
        fetchCurrentTourProgress();
        fetchUserPurchaseInfo(); // This ensures characterId is fresh for audioDurations
      }
    }, [user?.id, tourId, fetchCurrentTourProgress, fetchUserPurchaseInfo])
  );

  // Fetch audio durations from file metadata
  useEffect(() => {
    const fetchAudioDurationsFromFile = async () => {
      if (!tour?.checkpoints || !characterId || tour.checkpoints.length === 0) {
        setAudioDurations({});
        return;
      }

      const newDurations: { [key: string]: number } = {};
      for (const checkpoint of tour.checkpoints) {
        try {
          const audioInfoResponse = await getTourAudioByCheckpointId(checkpoint.id, characterId as string);
          if (audioInfoResponse.response?.fileUrl) {
            const { sound, status } = await Audio.Sound.createAsync(
              { uri: audioInfoResponse.response.fileUrl },
              { shouldPlay: false },
              null,
              true
            );

            if (status.isLoaded && typeof status.durationMillis === 'number') {
              newDurations[checkpoint.id] = Math.round(status.durationMillis / 1000);
            } else {
              newDurations[checkpoint.id] = 0;
            }
            await sound.unloadAsync();
          } else {
            newDurations[checkpoint.id] = 0;
          }
        } catch (error) {
          console.error(`Error fetching or processing audio for checkpoint ${checkpoint.id}:`, error);
          newDurations[checkpoint.id] = 0;
        }
      }
      setAudioDurations(newDurations);
    };

    if (tour?.checkpoints && characterId) {
      fetchAudioDurationsFromFile();
    }
  }, [tour, characterId]); // Depends on tour (for checkpoints) and characterId

  // --- Location Tracking Logic ---
  // useEffect(() => {
  //   // Always start tracking when the user is on this screen.
  //   // The background task will notify every time the user approaches a checkpoint.
  //   if (tour?.checkpoints && tour.checkpoints.length > 0) {
  //     console.log("Starting location tracking for tour:", tour.title);
  //     startTracking(tour.checkpoints, tour.id);
  //   }
  //   // No cleanup function is returned, so tracking continues when the screen is left.
  //   // It will only be stopped explicitly by the user or when the app is killed.
  // }, [tour, startTracking]);

  const handleBack = () => {
    router.back()
  }

  const handleViewMap = () => {
    if (tour?.id) {
      if (tour.useCustomMap) {
        router.push(`/(screens)/tour_custom_map?tourId=${tour.id}`)
      } else {
        router.push(`/(screens)/tour_map?tourId=${tour.id}`)
      }
    }
  }

  const handleAudioPlay = async (checkpointId: string) => {
    if (!characterId) {
      console.error('No character ID found. Please select a character first.')
      return
    }
    if (!tourProgress?.id) {
      console.error('No tour progress found.')
      return
    }

    // Update tour progress with current checkpoint
    try {
      await updateTourProgress(tourProgress.id, {
        currentCheckpointId: checkpointId
      })
      // Refresh tour progress after update
      await fetchCurrentTourProgress()
    } catch (error) {
      console.error('Error updating tour progress:', error)
    }

    console.log("checkpoint in tour_audio file", checkpointId)

    router.push(`/audio_player?checkpointId=${checkpointId}&characterId=${characterId}&tourProgressId=${tourProgress.id}`)
  }

  const handleEndtour = () => {
    router.push(`/(screens)/end_tour_confirm?tourId=${tourId}`)
  }

  const getCheckpointStatus = (checkpointId: string) => {
    const totalDuration = audioDurations[checkpointId] || 0;
    if (!tourProgress) return { status: 'pending', progress: 0, total: totalDuration }

    const checkpointProgress = tourProgress.checkpointProgress?.find(
      (cp: CheckpointProgress) => cp.tourCheckpointId === checkpointId
    )

    if (checkpointProgress?.isCompleted) {
      return {
        status: 'completed',
        progress: checkpointProgress.progressSeconds,
        total: totalDuration || checkpointProgress.progressSeconds
      }
    }

    if (tourProgress.currentCheckpointId === checkpointId) {
      return {
        status: 'current',
        progress: checkpointProgress?.progressSeconds || 0,
        total: totalDuration
      }
    }

    return {
      status: 'pending',
      progress: checkpointProgress?.progressSeconds || 0,
      total: totalDuration
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const checkAndUpdateTourCompletion = useCallback(async () => {
    if (!tourProgress || !tour?.checkpoints || !tour.checkpoints.length) return;

    const allCheckpointsCompleted = tour.checkpoints.every(checkpoint => {
      const cpProgress = tourProgress.checkpointProgress?.find(
        cp => cp.tourCheckpointId === checkpoint.id
      );
      return cpProgress?.isCompleted;
    });

    if (allCheckpointsCompleted && !tourProgress.isCompleted) {
      try {
        console.log("All checkpoints completed. Marking tour as completed.");
        await updateTourProgress(tourProgress.id, {
          isCompleted: true,
          finishedAt: new Date().toISOString(),
        });
        await fetchCurrentTourProgress(); // Fetch the updated tour progress
      } catch (error) {
        console.error('Error updating tour completion status:', error);
      }
    }
  }, [tourProgress, tour?.checkpoints, fetchCurrentTourProgress]);

  useEffect(() => {
    if (tourProgress && tour?.checkpoints && tour.checkpoints.length > 0) {
      checkAndUpdateTourCompletion();
    }
  }, [tourProgress, tour?.checkpoints, checkAndUpdateTourCompletion]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Image source={{
          uri: tour?.thumbnailUrl,
        }}
          style={styles.headerImage}
        />
      </View>
      {/* Back Button */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
      >
        {/* Tour Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{tour?.title}</Text>
          {tourProgress?.isCompleted && (
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.green} />
              <Text style={styles.completedText}>Đã hoàn thành</Text>
            </View>
          )}
        </View>

        {/* Tour Stops */}
        <View style={styles.stopsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Các trạm</Text>
            <TouchableOpacity style={styles.viewAllButton} onPress={handleViewMap}>
              <Text style={styles.viewAllText}>Xem bản đồ</Text>
              <Ionicons name="map-outline" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {tour?.checkpoints
            .sort((a, b) => a.order - b.order)
            .map((stop) => {
              const { status, progress, total } = getCheckpointStatus(stop.id)
              return (
                <TouchableOpacity key={stop.id} style={styles.stopItem} onPress={() => handleAudioPlay(stop.id)}>
                  <View style={[
                    styles.stopNumber,
                    {
                      backgroundColor: status === 'completed' ? COLORS.green :
                        status === 'current' ? COLORS.primary :
                          COLORS.grey
                    }
                  ]}>
                    {status === 'completed' && <Ionicons name="checkmark" size={16} color="#fff" />}
                    {status === 'current' && <Ionicons name="locate" size={16} color="#fff" />}
                    {status === 'pending' && <Text style={{ color: '#fff', fontSize: 12 }}>{stop.order}</Text>}
                  </View>
                  <View style={styles.stopInfo}>
                    <Text style={styles.stopTitle}>{stop.title}</Text>
                    {(status !== 'pending' || progress > 0) && total > 0 && (
                      <Text style={styles.progressText}>
                        {status === 'completed' ? 'Đã hoàn thành' :
                          `Đã nghe: ${formatTime(progress)} / ${formatTime(total)}`}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              )
            })}
        </View>


        <TouchableOpacity
          style={{ marginHorizontal: 20, marginVertical: 15 }}
          onPress={handleEndtour}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.purpleGradient]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              paddingVertical: 15,
              paddingHorizontal: 20,
              borderRadius: 12,
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              Kết thúc
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Bottom spacing for fixed details panel */}
        <View style={{ height: 220 }} />
      </ScrollView>

      {/* Fixed Experience Details */}
      <View style={styles.fixedDetailsContainer}>
        <View style={styles.detailsHeader}>
          <Text style={styles.detailsTitle}>Kinh nghiệm thực tế</Text>
        </View>

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={20} color={COLORS.primary} style={styles.detailIcon} />
            <View>
              <Text style={styles.detailLabel}>Tổng thời gian</Text>
              <Text style={styles.detailValue}>{tour?.duration} giờ</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="sunny-outline" size={20} color={COLORS.primary} style={styles.detailIcon} />
            <View>
              <Text style={styles.detailLabel}>THời gian tuyệt nhất</Text>
              <Text style={styles.detailValue}>Buổi sáng</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="walk-outline" size={20} color={COLORS.primary} style={styles.detailIcon} />
            <View>
              <Text style={styles.detailLabel}>Độ khó</Text>
              <Text style={styles.detailValue}>Dễ</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="cash-outline" size={20} color={COLORS.primary} style={styles.detailIcon} />
            <View>
              <Text style={styles.detailLabel}>Giá</Text>
              <Text style={styles.detailValue}>{tour?.price.toLocaleString('vi-VN')} VND</Text>
            </View>
          </View>
        </View>

      </View>

    </SafeAreaView>
  )
}


