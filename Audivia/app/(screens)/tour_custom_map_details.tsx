import { View, TouchableOpacity, Text, SafeAreaView, StyleSheet, ActivityIndicator, Image, useWindowDimensions } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useEffect, useState, useRef } from "react"
import { Tour, CustomMapImage } from "@/models"
import { getTourById } from "@/services/tour"
import { COLORS } from "@/constants/theme"
import { FlatList, Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, { useAnimatedStyle, useSharedValue, withTiming, runOnJS } from "react-native-reanimated"

const AnimatedImage = Animated.createAnimatedComponent(Image);

interface ZoomableImageProps {
    item: CustomMapImage;
    onZoom: (isZoomed: boolean) => void;
}

const ZoomableImage = ({ item, onZoom }: ZoomableImageProps) => {
    const { width, height } = useWindowDimensions();

    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const translationX = useSharedValue(0);
    const savedTranslationX = useSharedValue(0);
    const translationY = useSharedValue(0);
    const savedTranslationY = useSharedValue(0);

    const panGesture = Gesture.Pan()
        .averageTouches(true)
        .onUpdate((e) => {
            'worklet';
            if (scale.value > 1) {
                const maxTranslateX = (width * scale.value - width) / 2;
                const maxTranslateY = (height * scale.value - height) / 2;
                translationX.value = Math.max(-maxTranslateX, Math.min(maxTranslateX, savedTranslationX.value + e.translationX));
                translationY.value = Math.max(-maxTranslateY, Math.min(maxTranslateY, savedTranslationY.value + e.translationY));
            }
        })
        .onEnd(() => {
            'worklet';
            savedTranslationX.value = translationX.value;
            savedTranslationY.value = translationY.value;
        });

    const pinchGesture = Gesture.Pinch()
        .onUpdate((e) => {
            'worklet';
            const newScale = savedScale.value * e.scale;
            if (newScale >= 1) {
                scale.value = newScale;
            }
        })
        .onEnd(() => {
            'worklet';
            if (scale.value < 1.1) {
                scale.value = withTiming(1);
                translationX.value = withTiming(0);
                translationY.value = withTiming(0);
                savedTranslationX.value = 0;
                savedTranslationY.value = 0;
                savedScale.value = 1;
                runOnJS(onZoom)(false);
            } else {
                savedScale.value = scale.value;
                runOnJS(onZoom)(true);
            }
        });

    const doubleTap = Gesture.Tap().numberOfTaps(2).onStart(() => {
        'worklet';
        if (scale.value > 1) {
            scale.value = withTiming(1);
            savedScale.value = 1;
            translationX.value = withTiming(0);
            savedTranslationX.value = 0;
            translationY.value = withTiming(0);
            savedTranslationY.value = 0;
            runOnJS(onZoom)(false);
        } else {
            scale.value = withTiming(2.5);
            savedScale.value = 2.5;
            runOnJS(onZoom)(true);
        }
    });

    const composedGesture = Gesture.Race(doubleTap, Gesture.Simultaneous(pinchGesture, panGesture));

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translationX.value }, { translateY: translationY.value }, { scale: scale.value }],
    }));

    return (
        <GestureDetector gesture={composedGesture}>
            <AnimatedImage source={{ uri: item.imageUrl }} style={[{ width, height }, animatedStyle]} resizeMode="contain" />
        </GestureDetector>
    )
}

export default function TourCustomMapDetailsScreen() {
    const router = useRouter()
    const { tourId } = useLocalSearchParams()
    const [tour, setTour] = useState<Tour>()
    const [loading, setLoading] = useState<boolean>(true)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isZoomed, setIsZoomed] = useState(false);

    const flatListRef = useRef<FlatList<any>>(null)
    const { width } = useWindowDimensions();

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

    const goBack = () => router.back();

    const sortedImages = tour?.customMapImages?.sort((a, b) => a.order - b.order) || [];

    const handleNext = () => {
        if (currentIndex < sortedImages.length - 1) {
            const nextIndex = currentIndex + 1;
            flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
            setCurrentIndex(nextIndex);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
            setCurrentIndex(prevIndex);
        }
    };

    const renderItem = ({ item }: { item: CustomMapImage }) => (
        <View style={[styles.carouselItem, { width }]}>
            <ZoomableImage
                item={item}
                onZoom={setIsZoomed}
            />
        </View>
    );

    const navButtonsStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(isZoomed ? 0 : 1),
            transform: [{ scale: withTiming(isZoomed ? 0.5 : 1) }]
        }
    })

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">Sơ đồ - {tour?.title ?? ''}</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Đang tải sơ đồ...</Text>
                </View>
            ) : sortedImages.length > 0 ? (
                <View style={styles.sliderContainer}>
                    <FlatList
                        ref={flatListRef}
                        data={sortedImages}
                        renderItem={renderItem}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.imageUrl}
                        scrollEnabled={false} // Disable swiping!
                        onMomentumScrollEnd={(event) => { // Update index if scrolled programmatically
                            const contentOffsetX = event.nativeEvent.contentOffset.x;
                            const index = Math.round(contentOffsetX / width);
                            setCurrentIndex(index);
                        }}
                    />

                    <Animated.View style={[styles.navButton, styles.navButtonLeft, navButtonsStyle]}>
                        {currentIndex > 0 && (
                            <TouchableOpacity onPress={handlePrev}>
                                <Ionicons name="chevron-back-circle" size={44} color="#FFF" />
                            </TouchableOpacity>
                        )}
                    </Animated.View>
                    <Animated.View style={[styles.navButton, styles.navButtonRight, navButtonsStyle]}>
                        {currentIndex < sortedImages.length - 1 && (
                            <TouchableOpacity onPress={handleNext}>
                                <Ionicons name="chevron-forward-circle" size={44} color="#FFF" />
                            </TouchableOpacity>
                        )}
                    </Animated.View>


                    <View style={styles.counterContainer}>
                        <Text style={styles.counterText}>{currentIndex + 1}/{sortedImages.length}</Text>
                    </View>
                    <View style={styles.dotsContainer}>
                        {sortedImages.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    currentIndex === index && styles.activeDot
                                ]}
                            />
                        ))}
                    </View>
                </View>
            ) : (
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={60} color={COLORS.grey} />
                    <Text style={styles.errorText}>Không có sơ đồ tham quan</Text>
                </View>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'rgba(0,0,0,0.5)',
        position: 'absolute',
        top: 0, left: 0, right: 0,
        zIndex: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: '#fff',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    sliderContainer: {
        flex: 1,
    },
    carouselItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navButton: {
        position: 'absolute',
        top: '50%',
        transform: [{ translateY: -22 }],
        zIndex: 10,
    },
    navButtonLeft: {
        left: 15,
    },
    navButtonRight: {
        right: 15,
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
    counterContainer: {
        position: 'absolute',
        bottom: 10,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        zIndex: 10,
    },
    counterText: {
        color: '#fff',
        fontSize: 14,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: COLORS.primary,
        width: 12,
        height: 12,
        borderRadius: 6,
    },
});