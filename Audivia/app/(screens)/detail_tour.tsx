import { useEffect, useState, useCallback } from "react"
import { View, TouchableOpacity, Text, SafeAreaView, ScrollView, Modal } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { styles } from "@/styles/tour_detail.styles"
import type { Tour } from "@/models"
import { getTourById, hasTourAudioForTour } from "@/services/tour"
import { checkUserPurchasedTour } from "@/services/historyTransaction"
import { TourHeader } from "@/components/detail_tour/TourHeader"
import { AboutTab } from "@/components/detail_tour/AboutTab"
import { BeforeTab } from "@/components/detail_tour/BeforeTab"
import { ReviewsTab } from "@/components/detail_tour/ReviewsTab"
import { TourTabs } from "@/components/detail_tour/TourTabs"
import { useUser } from "@/hooks/useUser"
import { COLORS } from "@/constants/theme"
import { createTransactionHistory } from "@/services/historyTransaction"
import { createNotification } from "@/services/notification"
import { useNotificationCount } from "@/hooks/useNotificationCount"
import { getTourProgress, createTourProgress } from "@/services/progress"
import { LinearGradient } from "expo-linear-gradient"
import { formatMoney } from "@/utils/formatter"

export default function TourDetailScreen() {
  const [activeTab, setActiveTab] = useState("about")
  const router = useRouter()
  const { tourId } = useLocalSearchParams()
  const [tour, setTour] = useState<Tour>()
  const { user } = useUser()
  const [transaction, setTransaction] = useState<any>()
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const { unreadCount, loadUnreadCount } = useNotificationCount()
  const [hasAudio, setHasAudio] = useState<boolean>(false)

  const fetchTourById = useCallback(async () => {
    try {
      const response = await getTourById(tourId as string)
      const checkHasAudioForTour = await hasTourAudioForTour(tourId as string)
      setTour(response.response)
      setHasAudio(!!checkHasAudioForTour)
    } catch (error) {
      console.error("Error fetching tour by id:", error)
    }
  }, [tourId])

  useEffect(() => {
    const checkIfUserPurchasedTour = async () => {
      if (!user?.id) return
      const response = await checkUserPurchasedTour(user?.id, tourId as string)
      console.log(response)
      setTransaction(response)
    }
    fetchTourById()
    checkIfUserPurchasedTour()
  }, [tourId, user?.id, fetchTourById])

  const goBack = () => {
    router.back()
  }

  const toggleFavorite = () => {
    // Xử lý thêm vào danh sách yêu thích
  }

  const startTour = () => {
    router.push(`/character_selection?tourId=${tourId}`)
  }

  const handlePurchase = async () => {

    if (transaction) {
      try {
        // Check if tour progress exists
        const existingProgress = await getTourProgress(user?.id as string, tourId as string);

        if (existingProgress.response === null) {
          const progressData = {
            tourId: tourId as string,
            userId: user?.id as string,
            startedAt: new Date().toISOString(),
            finishedAt: null,
            isCompleted: false,
            currentCheckpointId: tour?.checkpoints[0]?.id || null,
            score: 0,
            groupMode: false,
            groupId: null
          };
          console.log('Creating new tour progress:', progressData);
          await createTourProgress(progressData);
        }
      } catch (error) {
        console.error('Error handling tour progress:', error);
      }
      startTour();
    } else {
      setShowPurchaseModal(true);
    }
  }


  const amountToDeposit = Math.max((tour?.price ?? 0) - (user?.balanceWallet ?? 0), 0)

  const handleConfirmPurchase = async () => {
    if (user?.balanceWallet as number < (tour?.price as number)) {
      router.push(`/deposit?tourId=${tourId}&redirect=detail&amount=${amountToDeposit}`)
    } else {
      await createNewTransactionHistory()

      const notificationParams = {
        userId: user?.id as string,
        tourId: tourId as string,
        content: `Bạn đã mua thành công tour: ${tour?.title}.\nHãy bắt đầu trải nghiệm ngay bây giờ!`,
        type: "Thanh toán tour",
        isRead: false,
      }
      await createNotification(notificationParams)
      loadUnreadCount()

      router.push(`/detail_tour?tourId=${tourId}`)
    }
  }

  const createNewTransactionHistory = async () => {
    const params = {
      userId: user?.id as string,
      tourId: tourId as string,
      amount: tour?.price as number,
      description: tour?.title as string,
      type: "purchase",
      status: "success"
    }
    const response = await createTransactionHistory(params)
    console.log(response)


  }

  return (
    <SafeAreaView style={styles.container}>
      {tour && <TourHeader tourDetail={tour} onBack={goBack} onToggleFavorite={toggleFavorite} />}

      <View style={styles.tabContentWrapper}>
        <TourTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {/* Wrapper for content below tabs */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Tab Content */}
          {activeTab === "about" && <AboutTab tour={tour} {...(!hasAudio ? { notForSaleMessage: 'Hiện tại tour đang phát triển, cùng chờ đợi nhé!' } : {})} />}
          {activeTab === "before" && <BeforeTab tour={tour} />}
          {activeTab === "reviews" && <ReviewsTab tour={tour} onReviewChange={fetchTourById} />}

          {/* Bottom spacing */}
          <View style={{ height: 80 }} />
        </ScrollView>
      </View>

      {/* Start Button */}
      <View style={styles.startButtonContainer}>
        {/* Price Display */}
        <View style={styles.priceDisplayContainer}>
          <Text style={styles.priceDisplayText}>{tour?.price.toLocaleString('vi-VN')} Đ</Text>
        </View>
        <View style={styles.startButtonWrapper}>
          {hasAudio ? (
            <LinearGradient
              colors={[COLORS.primary, COLORS.purpleGradient]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.startButtonGradient}
            >
              <TouchableOpacity style={styles.startButton} onPress={handlePurchase}>
                <Text style={styles.startButtonText}>{transaction ? "Bắt đầu" : "Mua tour"}</Text>
              </TouchableOpacity>
            </LinearGradient>
          ) : (
            <View style={[styles.startButton, { backgroundColor: '#ffe0b2', justifyContent: 'center', alignItems: 'center' }]}> 
              <Text style={[styles.startButtonText, { color: '#ff5722' }]}>Chưa mở bán</Text>
            </View>
          )}
        </View>

      </View>

      <Modal
        visible={showPurchaseModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPurchaseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirm Purchase</Text>
              <TouchableOpacity onPress={() => setShowPurchaseModal(false)}>
                <Text style={styles.closeText}>X</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.tourInfoRow, { justifyContent: 'space-between', alignItems: 'center' }]}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.tourName}>{tour?.title}</Text>
                {/* <Text style={styles.tourDesc}>45-mins guided experience</Text> */}
              </View>
              <Text style={styles.tourPrice}>{tour?.price.toLocaleString('vi-VN')} VNĐ</Text>
            </View>

            <View style={styles.paymentMethodHeader}>
              <Text style={styles.paymentMethodTitle}>Phương thức thanh toán</Text>
              {/* <TouchableOpacity>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity> */}
            </View>
            <View style={styles.walletBox}>
              <View style={styles.walletLeft}>
                <Text style={styles.walletName}>Ví Audivia</Text>
                <Text style={styles.walletBalance}>Số dư: {user?.balanceWallet.toLocaleString('vi-VN')} VNĐ</Text>
              </View>
              {/* <TouchableOpacity>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity> */}
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tổng tiền: </Text>
              <Text style={styles.totalAmount}>{tour?.price.toLocaleString('vi-VN')} VNĐ</Text>
            </View>

            <LinearGradient
              colors={[COLORS.primary, COLORS.purpleGradient]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.purchaseButton}
            >
              <TouchableOpacity onPress={handleConfirmPurchase}>
                <Text style={styles.purchaseButtonText}>Xác nhận thanh toán</Text>
              </TouchableOpacity>
            </LinearGradient>

            <View style={styles.secureRow}>
              <Text style={styles.secureText}>Giao dịch được bảo mật bởi Audivia</Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}
