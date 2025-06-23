import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { router } from 'expo-router';
import { useUser } from '@/hooks/useUser';
import { getHistoryTransactionByUserId } from '@/services/historyTransaction';
import { getTourProgress } from '@/services/progress';
import { Checkpoint, Tour, TourProgress, TransactionHistory } from '@/models';
import { getTourCheckpointById } from '@/services/tour_checkpoint';

interface TourHistoryItemProps {
    tour: Tour;
    progress: TourProgress | null;
}

const TourHistoryItem = ({ tour, progress }: TourHistoryItemProps) => {
    const [lastCheckpoint, setLastCheckpoint] = useState<Checkpoint | null>(null);
    const [loadingCheckpoint, setLoadingCheckpoint] = useState(false);

    useEffect(() => {
        const fetchLastCheckpoint = async () => {
            if (progress && progress.currentCheckpointId) {
                setLoadingCheckpoint(true);
                try {
                    const checkpointData = await getTourCheckpointById(progress.currentCheckpointId);
                    setLastCheckpoint(checkpointData);
                } catch (error) {
                    console.error("Failed to fetch last checkpoint details:", error);
                } finally {
                    setLoadingCheckpoint(false);
                }
            }
        };
        fetchLastCheckpoint();
    }, [progress]);

    const totalCheckpoints = tour.checkpoints?.length || 0;
    const lastCheckpointIndex = lastCheckpoint ? tour.checkpoints?.findIndex(cp => cp.id === lastCheckpoint.id) + 1 : 0;

    const renderProgressInfo = () => {
        if (!progress) {
            return (
                <View style={styles.progressInfo}>
                    <Ionicons name="play-circle-outline" size={20} color={COLORS.green} />
                    <Text style={[styles.progressText, { color: COLORS.green }]}>
                        Sẵn sàng để bắt đầu!
                    </Text>
                </View>
            );
        }

        if (progress.isCompleted) {
            return (
                <View style={styles.progressInfo}>
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.green} />
                    <Text style={[styles.progressText, { color: COLORS.green }]}>
                        Đã hoàn thành
                    </Text>
                </View>
            );
        }

        if (loadingCheckpoint) {
            return <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: 10 }} />;
        }

        if (lastCheckpoint) {
            return (
                <View style={styles.progressInfo}>
                    <Ionicons name="flag" size={18} color={COLORS.primary} />
                    <Text style={styles.progressText} numberOfLines={1}>
                        Địa điểm hiện tại: {lastCheckpoint.title} ({lastCheckpointIndex}/{totalCheckpoints})
                    </Text>
                </View>
            );
        }

        // Default for InProgress but checkpoint not loaded yet, or no checkpoint yet
        return (
            <View style={styles.progressInfo}>
                <Ionicons name="play-circle-outline" size={20} color={COLORS.primary} />
                <Text style={styles.progressText}>
                    Hãy bắt đầu hành trình của bạn!
                </Text>
            </View>
        );
    };

    return (
        <TouchableOpacity style={styles.historyItem} onPress={() => router.push(`/detail_tour?tourId=${tour.id}` as any)}>
            <Image source={{ uri: tour.thumbnailUrl }} style={styles.tourImage} />
            <View style={styles.tourOverlay}>
                <Text style={styles.tourTitle} numberOfLines={1}>{tour.title}</Text>
                {progress?.finishedAt && (
                    <Text style={styles.tourDate}>Hoàn thành ngày {new Date(progress.finishedAt).toLocaleDateString()}</Text>
                )}
            </View>

            <View style={styles.reviewContainer}>
                {renderProgressInfo()}
            </View>
        </TouchableOpacity>
    );
};

const TourHistoryScreen = () => {
    const { user } = useUser();
    const [history, setHistory] = useState<{ tour: Tour; progress: TourProgress | null }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const purchasedTours = await getHistoryTransactionByUserId(user.id) || [];
                const historyData = await Promise.all(
                    purchasedTours.map(async (pTour: any) => {
                        try {
                            const progressResponse = await getTourProgress(user.id, pTour.tour.id);
                            return { tour: pTour.tour, progress: progressResponse?.response || null };
                        } catch (error) {
                            return { tour: pTour.tour, progress: null };
                        }
                    })
                );

                setHistory(historyData);
            } catch (error) {
                console.error("Failed to fetch tour history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user]);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Lịch sử tour</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            </SafeAreaView>
        );
    }

    const completedTours = history.filter(h => h.progress?.isCompleted === true);
    const inProgressTours = history.filter(h => h.progress && !h.progress.isCompleted);
    const notStartedTours = history.filter(h => !h.progress);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Lịch sử tour</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{history.length}</Text>
                        <Text style={styles.statLabel}>Tours đã mua</Text>
                    </View>
                </View>

                {history.length === 0 && !loading && (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Bạn chưa tham gia tour nào.</Text>
                    </View>
                )}

                {inProgressTours.length > 0 && (
                    <View style={styles.historySection}>
                        <Text style={styles.sectionTitle}>Đang nghe</Text>
                        {inProgressTours.map(({ tour, progress }) => (
                            <TourHistoryItem key={`in-progress-${tour.id}`} tour={tour} progress={progress} />
                        ))}
                    </View>
                )}

                {notStartedTours.length > 0 && (
                    <View style={styles.historySection}>
                        <Text style={styles.sectionTitle}>Chưa bắt đầu</Text>
                        {notStartedTours.map(({ tour, progress }) => (
                            <TourHistoryItem key={`not-started-${tour.id}`} tour={tour} progress={progress} />
                        ))}
                    </View>
                )}

                {completedTours.length > 0 && (
                    <View style={styles.historySection}>
                        <Text style={styles.sectionTitle}>Đã hoàn thành</Text>
                        {completedTours.map(({ tour, progress }) => (
                            <TourHistoryItem key={`completed-${tour.id}`} tour={tour} progress={progress} />
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6f8',
    },
    header: {
        height: 56,
        backgroundColor: COLORS.primary,
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
        paddingHorizontal: 20,
    },
    emptyText: {
        fontSize: 18,
        color: COLORS.grey,
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e8e8e8',
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
    },
    historySection: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.dark,
        marginBottom: 16,
    },
    historyItem: {
        marginBottom: 20,
        borderRadius: 16,
        backgroundColor: '#fff',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    tourImage: {
        width: '100%',
        height: 160,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    tourOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    tourTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    tourDate: {
        color: '#fff',
        fontSize: 13,
        opacity: 0.9,
    },
    reviewContainer: {
        padding: 16,
        minHeight: 50,
    },
    progressInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eef7ff',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    progressText: {
        marginLeft: 10,
        fontSize: 15,
        color: COLORS.primary,
        fontWeight: '600',
        flex: 1,
    },
});

export default TourHistoryScreen;