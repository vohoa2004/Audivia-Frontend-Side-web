import React, { useRef, useState, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  Linking,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import { COLORS } from "@/constants/theme"
import styles from "@/styles/deposit.styles"
import { createPaymentIntent, checkPaymentStatus } from "@/services/payment"
import QRCode from "react-native-qrcode-svg"
import ViewShot, { captureRef } from "react-native-view-shot"
import * as MediaLibrary from "expo-media-library"
import { useUser } from "@/hooks/useUser"
import { createNotification } from "@/services/notification"
import { useNotificationCount } from "@/hooks/useNotificationCount"

export default function DepositScreen() {
  const params = useLocalSearchParams()
  const [amount, setAmount] = useState(params.amount ? String(params.amount) : "")
  const [isProcessing, setIsProcessing] = useState(false)
  const [qrInfo, setQrInfo] = useState<any>(null)
  const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'PAID' | 'failed'>('PENDING')
  const qrRef = useRef<ViewShot>(null)
  const router = useRouter()
  const { user } = useUser()
  const { unreadCount, loadUnreadCount } = useNotificationCount()

  const goBack = () => router.back()

  const handleAmountChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "")
    setAmount(numericValue)
  }

  const generateQRCode = async () => {
    if (!amount || Number.parseInt(amount) <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số tiền hợp lệ")
      return
    }

    try {
      setIsProcessing(true)
      console.log(user?.id);

      const userId = user?.id as string
      const returnUrl = "audivia://payment_success"
      const cancelUrl = "audivia://payment_cancel"
      const response = await createPaymentIntent(
        userId,
        returnUrl,
        cancelUrl,
        Number(amount),
        "Nạp tiền vào ví"
      )
      console.log(response);

      setQrInfo(response.qrCode)
      setPaymentStatus('PENDING')
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tạo mã QR. Vui lòng thử lại." + error)
    } finally {
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const checkStatus = async () => {
      console.log("status 1");
      console.log(qrInfo?.paymentLinkId);

      //   if (!qrInfo?.paymentLinkId) return;

      try {
        const response = await checkPaymentStatus(qrInfo.paymentLinkId)
        console.log(response);

        const status = response.status

        if (status === 'PAID') {
          setPaymentStatus('PAID')
          try {
            const notificationParams = {
              userId: user?.id as string,
              content: `Bạn đã nạp thành công ${response.amount} VNĐ vào ví!`,
              type: "Nạp ví Audivia",
              isRead: false,
            }
            await createNotification(notificationParams)
            await loadUnreadCount()
          } catch (error) {
            console.error('Lỗi khi tạo thông báo:', error)
          }
          router.push(`/(screens)/payment_success?tourId=${params.tourId}&redirect=${params.redirect}`)
          clearInterval(intervalId)
        } else if (status === 'CANCELLED' || status === 'EXPIRED') {
          setPaymentStatus('failed')
          Alert.alert("Thất bại", "Thanh toán không thành công")
          clearInterval(intervalId)
        }
      } catch (error) {
        console.error('Lỗi khi kiểm tra trạng thái thanh toán:', error)
      }
    }

    console.log('Debug interval setup:', {
      qrInfoPaymentLinkId: qrInfo?.paymentLinkId,
      paymentStatus,
      shouldSetInterval: qrInfo?.paymentLinkId && paymentStatus === 'PENDING'
    });

    if (qrInfo?.paymentLinkId && paymentStatus === 'PENDING') {
      // Kiểm tra trạng thái mỗi 5 giây
      intervalId = setInterval(checkStatus, 5000)
      console.log('Interval set successfully');
    }

    return () => {
      if (intervalId) {
        console.log('Cleaning up interval');
        clearInterval(intervalId)
      }
    }
  }, [qrInfo?.paymentLinkId, paymentStatus])

  const formatCurrency = (value: string) => {
    if (!value) return ""
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(value))
  }

  const saveQrToGallery = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Lỗi", "Không có quyền truy cập thư viện ảnh")
        return
      }

      if (qrRef.current) {
        const qrCodeImage = qrRef.current as ViewShot;
        // @ts-ignore: Linter incorrectly flags qrCodeImage as possibly undefined here
        const uri = await qrCodeImage.capture() as string;
        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync("QR Codes", asset, false);

        Alert.alert("Thành công", "Đã lưu mã QR vào thư viện ảnh");
      } else {
        Alert.alert("Lỗi", "Không thể tạo ảnh QR: qrRef chưa sẵn sàng.")
      }

    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu ảnh")
      console.error(error)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.light} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mã VietQR thanh toán</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.amountInputContainer}>
          <Text style={styles.inputLabel}>Nhập số tiền muốn nạp</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={handleAmountChange}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor={COLORS.grey}
            />
            <Text style={styles.currencyLabel}>VND</Text>
          </View>
          {amount ? (
            <Text style={styles.amountInWords}>
              {formatCurrency(amount)}
            </Text>
          ) : null}

          <TouchableOpacity
            style={[
              styles.generateButton,
              !amount ? styles.generateButtonDisabled : null,
            ]}
            onPress={generateQRCode}
            disabled={!amount || isProcessing}
          >
            <Text style={styles.generateButtonText}>
              {isProcessing ? "Đang xử lý..." : "Nạp tiền"}
            </Text>
          </TouchableOpacity>
        </View>

        {qrInfo && (
          <View style={styles.vietQrContainer}>
            <Text style={styles.vietQrInstructionText}>Mở Ứng Dụng Ngân Hàng Quét QRCode</Text>
            <Image source={require('../../assets/images/logo-vietqr.png')} style={styles.vietQrLogo} />

            <View style={styles.qrWrapperInner}>
              <ViewShot ref={qrRef} options={{ format: "png", quality: 1.0 }}>
                <QRCode
                  value={qrInfo.qrCode}
                  size={200}
                  backgroundColor="white"
                  color="black"
                />
              </ViewShot>
            </View>

            <View style={styles.napasMBLogos}>
              <Image source={require('../../assets/images/logo_napas.png')} style={styles.napasLogo} />
              <Image source={require('../../assets/images/mb-bank-logo.png')} style={styles.bidvLogo} />
            </View>

            <View style={styles.bankInfoGrid}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 8 }}>
                <Text style={styles.infoLabel}>Số tiền:</Text>
                <Text style={styles.infoValue}>{formatCurrency(String(qrInfo.amount))}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 8 }}>
                <Text style={styles.infoLabel}>Tên chủ TK:</Text>
                <Text style={styles.infoValue}>{qrInfo.accountName}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                <Text style={styles.infoLabel}>Số TK:</Text>
                <Text style={styles.infoValue}>{qrInfo.accountNumber}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 8 }}>
                <Text style={styles.infoLabel}>Nội dung chuyển khoản:</Text>
                <Text style={styles.infoValue}>Nap tien vao vi</Text>
              </View>
            </View>


            <TouchableOpacity
              style={styles.printButton}
              onPress={saveQrToGallery}
            >
              {/* <Text style={styles.printButtonText}>In nhanh mã</Text> */}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
