import { Text, SafeAreaView, TouchableOpacity, View, StyleSheet } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "@/constants/theme"
import { useEffect } from "react"

export default function PaymentSuccessScreen() {
  const params = useLocalSearchParams()
    const router = useRouter()

    useEffect(() => {
        const timer = setTimeout(() => {
          if (params.redirect === 'detail' && params.tourId) {
            router.replace(`/(screens)/detail_tour?tourId=${params.tourId}`)
        } else {
          router.replace('/(screens)/history_transaction')
        }
        }, 2000)

        return () => clearTimeout(timer)
    }, [])

    // const handleNavigateToHistory = () => {
    //     router.replace('/(screens)/history_transaction')
    // }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="checkmark-circle" size={100} color={COLORS.primary} />
                </View>
                
                <Text style={styles.title}>Thanh toán thành công!</Text>
                <Text style={styles.subtitle}>Giao dịch của bạn đã được xử lý thành công</Text>

                <View style={styles.buttonContainer}>
                    {/* <TouchableOpacity 
                        style={styles.primaryButton}
                        onPress={handleNavigateToWallet}
                    >
                        <Ionicons name="wallet-outline" size={24} color={COLORS.light} />
                        <Text style={styles.primaryButtonText}>Về ví của tôi</Text>
                    </TouchableOpacity> */}

                    {/* <TouchableOpacity 
                        style={styles.secondaryButton}
                        onPress={handleNavigateToHistory}
                    >
                        <Ionicons name="time-outline" size={24} color={COLORS.primary} />
                        <Text style={styles.secondaryButtonText}>Xem lịch sử giao dịch</Text>
                    </TouchableOpacity> */}
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.light,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    iconContainer: {
        marginBottom: 30,
        backgroundColor: COLORS.light,
        borderRadius: 100,
        padding: 20,
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.dark,
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.grey,
        marginBottom: 40,
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        gap: 15,
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 12,
        gap: 10,
    },
    primaryButtonText: {
        color: COLORS.light,
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.light,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.primary,
        gap: 10,
    },
    secondaryButtonText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: '600',
    },
})
