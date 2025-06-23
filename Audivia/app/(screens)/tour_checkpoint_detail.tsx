import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { getTourCheckpointById } from "@/services/tour_checkpoint";

interface CheckpointImage {
    id: string;
    imageUrl: string;
    // Add other image properties if they exist
}

interface TourCheckpointData {
    id: string;
    title: string;
    description: string;
    images: CheckpointImage[];
    // Add other checkpoint properties if they exist
}

export default function TourCheckpointDetail() {
    const {checkpointId } = useLocalSearchParams()
    const [checkPoint, setCheckpoint] = useState<TourCheckpointData | null>(null)
    const [images, setImages] = useState<CheckpointImage[]>([])
    const fetchCheckPoint = async () => {
        try {
            const response = await getTourCheckpointById(checkpointId as string)
            setCheckpoint(response as TourCheckpointData)
            setImages(response.images as CheckpointImage[])
            
        } catch (error) {
            console.error("Error at tour checkpoint detail", error);
            
        } 
    }

    useEffect(() => {
        if (checkpointId) {
            fetchCheckPoint()
        }
    }, [checkpointId])

    useEffect(() => {
        console.log("Images state updated:", images);
    }, [images]);

    const goBack = () => router.back()
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={24} color="#00AEEF" />
        </TouchableOpacity>
      </View>

      {/* Carousel of Images */}
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {images && images.map((image, index) => (
          <Image
            key={image.id || index}
            source={{ uri: image.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          /> 
        ))}
      </ScrollView>

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* Rating */}
        {/* <View style={styles.ratingContainer}>
          <MaterialIcons name="star-rate" size={18} color="#FFD700" />
          <Text style={styles.ratingText}>4.8</Text>
        </View> */}

        {/* Title & Icon */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>{checkPoint?.title}</Text>
          <Ionicons name="game-controller-outline" size={28} color="#00AEEF" />
        </View>

        {/* Location */}
        {/* <Text style={styles.location}>Binh Duong, Vietnam</Text> */}

        {/* Info Row */}
        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Ionicons name="time-outline" size={20} color="#00AEEF" />
            <Text style={styles.infoText}>2-3 giờ{"\n"}<Text style={styles.infoLabel}>Thời lượng</Text></Text>
          </View>
          <View style={styles.infoBox}>
            <Ionicons name="cash-outline" size={20} color="#00AEEF" />
            <Text style={styles.infoText}>$Free{"\n"}<Text style={styles.infoLabel}>Chi phí</Text></Text>
          </View>
          <View style={styles.infoBox}>
            <Ionicons name="language-outline" size={20} color="#00AEEF" />
            <Text style={styles.infoText}>1{"\n"}<Text style={styles.infoLabel}>Ngôn ngữ</Text></Text>
          </View>
        </View>

        {/* About */}
        <Text style={styles.sectionTitle}>Giới thiệu</Text>
        <Text style={styles.aboutText}>
          {checkPoint?.description}
        </Text>

        {/* What's Included */}
        <Text style={styles.sectionTitle}>Trải nghiệm bạn sẽ nhận được</Text>
            <View style={styles.includedList}>
            <Text style={styles.includedItem}>✔ Thuyết minh âm thanh sinh động, dễ hiểu</Text>
            <Text style={styles.includedItem}>✔ Dẫn đường bằng bản đồ tương tác thông minh</Text>
            <Text style={styles.includedItem}>✔ Hình ảnh và tư liệu lịch sử chân thực</Text>
            <Text style={styles.includedItem}>✔ Truy cập nội dung mọi lúc</Text>
        </View>


        {/* Mascot */}
        <View style={{ alignItems: "flex-end", marginTop: 8 }}>
          <Image
            source={{ uri: "https://your-mascot-url.png" }}
            style={{ width: 60, height: 60 }}
          />
        </View>
      </ScrollView>

      {/* Play Button */}
      {/* <TouchableOpacity style={styles.playButton}>
        <Ionicons name="play" size={32} color="#fff" />
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  image: {
    width: 400, 
    height: "auto", 
    marginRight: 8,
    marginBottom: 0,
  },
  content: { flex: 1, padding: 16, marginTop: 5, marginLeft: 8 },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: -30,
    left: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 2,
    elevation: 2,
  },
  ratingText: { marginLeft: 4, fontWeight: "bold", color: "#333" },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
    justifyContent: "space-between",
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#222", flex: 1 },
  location: { color: "#888", marginBottom: 12 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  infoBox: {
    backgroundColor: "#F6F8FA",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    width: "30%",
    marginTop: 15
  },
  infoText: { textAlign: "center", fontWeight: "bold", color: "#222" },
  infoLabel: { fontWeight: "normal", color: "#888", fontSize: 12 },
  sectionTitle: { fontWeight: "bold", fontSize: 16, marginTop: 16, marginBottom: 4 },
  aboutText: { color: "#444", marginBottom: 8 },
  includedList: { marginLeft: 8, marginBottom: 8 },
  includedItem: { color: "#00AEEF", marginBottom: 2 },
  playButton: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
    backgroundColor: "#00AEEF",
    borderRadius: 32,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
});
