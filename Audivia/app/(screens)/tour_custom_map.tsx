import { View, TouchableOpacity, Text, SafeAreaView, StyleSheet, ActivityIndicator } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import { Tour } from "@/models"
import { getTourById } from "@/services/tour"
import { TourCustomMap } from "@/components/detail_tour/TourCustomMap"
import { COLORS } from "@/constants/theme"

export default function TourCustomMapScreen() {
    const router = useRouter()
    const { tourId } = useLocalSearchParams()
    const [tour, setTour] = useState<Tour>()
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchTourById = async () => {
            try {
                setLoading(true)
                const response = await getTourById(tourId as string)
                setTour(response.response)
            } catch (error) {
                console.error("Error fetching tour:", error)
            } finally {
                setLoading(false)
            }
        }

        if (tourId) {
            fetchTourById()
        }
    }, [tourId])

    const goBack = () => {
        router.back()
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    Bản đồ
                    {tour?.title ? ` - ${tour.title.substring(0, 15)}${tour.title.length > 15 ? '...' : ''}` : ''}
                </Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Tour Map */}
            {/* {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Đang tải bản đồ...</Text>
                </View>
            ) : tour ? (
                <View style={styles.mapWrapper}>
                    <TourCustomMap tour={tour} height={650} />
                </View>
            ) : (
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={60} color={COLORS.grey} />
                    <Text style={styles.errorText}>Không thể tải thông tin tour</Text>
                </View>
            )} */}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    mapWrapper: {
        flex: 1,
        margin: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: COLORS.grey,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        marginTop: 12,
        fontSize: 16,
        color: COLORS.grey,
        textAlign: 'center',
    },
}); 