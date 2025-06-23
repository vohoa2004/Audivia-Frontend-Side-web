import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView, FlatList } from "react-native"
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons"
import { COLORS } from "@/constants/theme"
import { useRouter } from "expo-router"
import styles from "@/styles/history_transaction.styles"
import { useUser } from "@/hooks/useUser"
import { getHistoryTransactionByUserId, getPaymentTransactionHistory } from "@/services/historyTransaction"


export default function WalletScreen() {
  const [activeTab, setActiveTab] = useState("all")
  const router = useRouter()
  const { user } = useUser()
  const [paymentHistories, setPaymentHistories] = useState<any[]>([])
  const [purchasedHistories, setPurchasedHistories] = useState<any[]>([])

  const goBack = () => {
    router.back()
  }

  const getPaymentHistories = async () => {
    try{
      const response = await getPaymentTransactionHistory(user?.id as string)
      setPaymentHistories(response)
    } catch (error)
    {
      console.error("Fetching payment histories", error);
      
    }
  } 

  const getPurchasedHistories = async () => {
    try {
      const response = await getHistoryTransactionByUserId(user?.id as string)
      setPurchasedHistories(response)
    } catch (error) {
      console.error("Fetching purchased histories", error);
    }
  }

  useEffect(() => {
    if (user?.id){
      getPaymentHistories()
      getPurchasedHistories()
    }

  }, [user?.id])


  const navigateToDeposit = () => {
    router.push("/deposit")
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <Ionicons name="arrow-down-circle" size={24} color={COLORS.green} />
      case "payment":
        return <Ionicons name="cart" size={24} color={COLORS.red} />
      case "refund":
        return <Ionicons name="return-down-back" size={24} color={COLORS.blue} />
      default:
        return <Ionicons name="swap-horizontal" size={24} color={COLORS.orange} />
    }
  }

    const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
  }

  const getAllTransactions = () => {
    const allTransactions = [
      ...(paymentHistories || []).map(item => ({
        ...item,
        type: 'payment',
        displayTime: item.paymentTime
      })),
      ...(purchasedHistories || []).map(item => ({
        ...item,
        type: 'purchase',
        displayTime: item.createdAt
      }))
    ];
    
    return allTransactions.sort((a, b) => 
      new Date(b.displayTime).getTime() - new Date(a.displayTime).getTime()
    );
  }

  const renderAllTransaction = ({ item }: { item: any }) => {
    if (item.type === 'payment') {
      return (
        <TouchableOpacity style={styles.transactionItem}>
          <View style={styles.transactionIconContainer}>{getTransactionIcon("deposit")}</View>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionDescription}>{item.description}</Text>
            <Text style={styles.transactionDateTime}>
              {formatDateTime(item.paymentTime)}
            </Text>
          </View>
          <Text style={[styles.transactionAmount, { color: item.amount >= 0 ? COLORS.green : COLORS.red }]}>
            +{formatCurrency(item.amount)}
          </Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity style={styles.transactionItem}>
          <View style={styles.transactionIconContainer}>{getTransactionIcon("payment")}</View>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionDescription}>{item.tour?.title || item.description}</Text>
            <Text style={styles.transactionDateTime}>
              {formatDateTime(item.createdAt)}
            </Text>
          </View>
          <Text style={[styles.transactionAmount, { color: COLORS.red }]}>
            -{formatCurrency(item.amount)}
          </Text>
        </TouchableOpacity>
      );
    }
  }

  const renderTransaction = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.transactionItem}>
      <View style={styles.transactionIconContainer}>{getTransactionIcon("deposit")}</View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        {/* {item.tourName && <Text style={styles.transactionTourName}>{item.tourName}</Text>} */}
        <Text style={styles.transactionDateTime}>
          {formatDateTime(item.paymentTime)}
        </Text>
      </View>
      <Text style={[styles.transactionAmount, { color: item.amount >= 0 ? COLORS.green : COLORS.red }]}>
        +{formatCurrency(item.amount)}
      </Text>
    </TouchableOpacity>
  )

  const renderPurchasedTransaction: ({ item }: { item: any }) => JSX.Element = ({ item }) => (
    <TouchableOpacity style={styles.transactionItem}>
      <View style={styles.transactionIconContainer}>{getTransactionIcon("payment")}</View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionDescription}>{item.tour?.title || item.description}</Text>
        <Text style={styles.transactionDateTime}>
          {formatDateTime(item.createdAt)}
        </Text>
      </View>
      <Text style={[styles.transactionAmount, { color: COLORS.red }]}>
        -{formatCurrency(item.amount)}
      </Text>
    </TouchableOpacity>
  )
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.light} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ví của tôi</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Wallet Balance */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Số dư ví</Text>
          <Text style={styles.balanceAmount}>{formatCurrency(user?.balanceWallet || 0)}</Text>
          <View style={styles.walletActions}>
            <TouchableOpacity style={styles.walletActionButton} onPress={navigateToDeposit}>
              <View style={styles.actionIconContainer}>
                <Ionicons name="add-circle-outline" size={24} color={COLORS.light} />
              </View>
              <Text style={styles.actionButtonText}>Nạp tiền</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.walletActionButton}>
              <View style={styles.actionIconContainer}>
                <Ionicons name="arrow-down-circle-outline" size={24} color={COLORS.light} />
              </View>
              <Text style={styles.actionButtonText}>Rút tiền</Text>
            </TouchableOpacity>
          </View>
        </View>


        {/* Transactions */}
        <View style={styles.transactionsCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Lịch sử giao dịch</Text>
            <TouchableOpacity>
              <Text style={styles.cardAction}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionTabs}>
            <TouchableOpacity
              style={[styles.transactionTab, activeTab === "all" && styles.activeTransactionTab]}
              onPress={() => setActiveTab("all")}
            >
              <Text style={[styles.transactionTabText, activeTab === "all" && styles.activeTransactionTabText]}>
                Tất cả
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.transactionTab, activeTab === "in" && styles.activeTransactionTab]}
              onPress={() => setActiveTab("in")}
            >
              <Text style={[styles.transactionTabText, activeTab === "in" && styles.activeTransactionTabText]}>
                Nạp tiền
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.transactionTab, activeTab === "out" && styles.activeTransactionTab]}
              onPress={() => setActiveTab("out")}
            >
              <Text style={[styles.transactionTabText, activeTab === "out" && styles.activeTransactionTabText]}>
                Mua tour
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === "all" ? (
            <FlatList
              data={getAllTransactions()}
              renderItem={renderAllTransaction}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : activeTab === "out" ? (
            <FlatList
              data={purchasedHistories}
              renderItem={renderPurchasedTransaction}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <FlatList
              data={paymentHistories}
              renderItem={renderTransaction}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          )}
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 20 }} />
      </ScrollView>

    </SafeAreaView>
  )
}
