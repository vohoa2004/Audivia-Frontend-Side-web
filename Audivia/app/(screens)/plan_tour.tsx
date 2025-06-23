import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { COLORS } from "@/constants/theme";
import styles from "@/styles/plan_tour.styles";
import { getSaveTourById, updateSaveTour } from "@/services/save_tour";
import { SaveTour } from "@/models";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import { BackButton } from "@/components/common/BackButton";
import { LinearGradient } from "expo-linear-gradient";

export default function PlanTourScreen() {
  const [planDate, setPlanDate] = useState("");
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const savedTourId = searchParams.id as string;
  const [tourInfor, setTour] = useState<SaveTour>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);


  const goBack = () => {
    router.back();
  };

  useEffect(() => {
    if (savedTourId) {
      getSaveTourById(savedTourId).then((res) => {
        setTour(res.response);
        // Nếu có plannedTime, chuyển đổi và hiển thị
        if (res.response.plannedTime) {
          const date = new Date(res.response.plannedTime);
          setSelectedDate(date);
        }
      });
    }
  }, [savedTourId]);

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleSavePlanTime = async () => {
    if (savedTourId && selectedDate) {
      console.log('savedTOUR', savedTourId);
      await updateSaveTour(savedTourId, selectedDate.toISOString());
      router.back();
    }
  };

  const formattedDisplayDate = selectedDate ? new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(selectedDate) : '';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Lên Lịch Tour</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Tour Info */}
        {tourInfor?.tour && (
          <View style={styles.tourInfoCard}>
            <Image
              source={{ uri: tourInfor.tour.thumbnailUrl }}
              style={styles.tourImage}
            />
            <View style={styles.tourInfoContent}>
              <Text style={styles.tourName}>{tourInfor.tour.title}</Text>
              <View style={styles.tourDetails}>
                <View style={styles.tourDetailItem}>
                  <Ionicons
                    name="location-outline"
                    size={16}
                    color={COLORS.grey}
                  />
                  <Text style={styles.tourDetailText}>
                    {tourInfor.tour.location}
                  </Text>
                </View>
                <View style={styles.tourDetailItem}>
                  <Ionicons name="time-outline" size={16} color={COLORS.grey} />
                  <Text style={styles.tourDetailText}>
                    {tourInfor.tour.duration} giờ
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
        {/* Notification */}
        <View style={styles.notification}>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationMessage}>
              <Text style={styles.notificationHighlight}>* </Text>
              Bằng cách lên lịch chuyến đi, Audy sẽ nhắc nhở bạn trước khi
              chuyến đi bắt đầu!
            </Text>
          </View>
          <Image
            source={{
              uri: "https://res.cloudinary.com/dgzn2ix8w/image/upload/v1745147401/Audivia/fxjo2mcpmqexcxkomtjd.png",
            }}
            style={styles.notificationImage}
          />
        </View>

        {/* Plan Visit Section */}
        <View style={styles.planSection}>
          <Text style={styles.sectionTitle}>Lên Lịch Chuyến Đi</Text>

          <View style={styles.dateInputContainer}>
            <Text style={styles.dateLabel}>Ngày Dự kiến</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={selectedDate ? styles.dateText : styles.datePlaceholder}>
                {selectedDate? formattedDisplayDate : "dd/mm/yyyy"}
              </Text>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.confirmButton} onPress={handleSavePlanTime}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.purpleGradient]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.confirmButton}
            >
              <Text style={styles.confirmButtonText}>Xác nhận lịch trình</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
            minimumDate={new Date()} // Không cho phép chọn ngày trong quá khứ
          />
        )}

        {/* Bottom Spacing */}
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
