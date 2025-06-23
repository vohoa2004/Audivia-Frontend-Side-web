import { COLORS } from "@/constants/theme";
import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F0F2F5",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      backgroundColor: COLORS.primary,
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    backButton: {
      padding: 4,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#fff",
    },
  
    balanceCard: {
      backgroundColor: COLORS.primary,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 30,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    balanceLabel: {
      fontSize: 16,
      color: "rgba(255, 255, 255, 0.8)",
      marginBottom: 8,
    },
    balanceAmount: {
      fontSize: 32,
      fontWeight: "bold",
      color: "#fff",
      marginBottom: 24,
    },
    walletActions: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    walletActionButton: {
      alignItems: "center",
    },
    actionIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
    },
    actionButtonText: {
      fontSize: 14,
      color: "#fff",
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
    },
    cardAction: {
      fontSize: 14,
      color: COLORS.primary,
      fontWeight: "500",
    },
    transactionsCard: {
      backgroundColor: "#fff",
      borderRadius: 16,
      marginHorizontal: 16,
      marginBottom: 16,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    transactionTabs: {
      flexDirection: "row",
      marginBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#F0F2F5",
    },
    transactionTab: {
      paddingVertical: 12,
      marginRight: 24,
    },
    activeTransactionTab: {
      borderBottomWidth: 2,
      borderBottomColor: COLORS.primary,
    },
    transactionTabText: {
      fontSize: 14,
      color: "#666",
    },
    activeTransactionTabText: {
      color: COLORS.primary,
      fontWeight: "bold",
    },
    transactionItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#F0F2F5",
    },
    transactionIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#F0F2F5",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    transactionDetails: {
      flex: 1,
    },
    transactionDescription: {
      fontSize: 16,
      fontWeight: "500",
      color: "#333",
    },
    transactionDateTime: {
      fontSize: 14,
      color: "#666",
    },
    transactionAmount: {
      fontSize: 16,
      fontWeight: "bold",
    },
    bottomNav: {
      flexDirection: "row",
      backgroundColor: "#fff",
      paddingTop: 8,
      paddingBottom: 24,
      borderTopWidth: 1,
      borderTopColor: "#E4E6EB",
    },
    navItem: {
      flex: 1,
      alignItems: "center",
    },
    navText: {
      fontSize: 12,
      marginTop: 4,
      color: "#65676B",
    },
    activeNavText: {
      color: COLORS.primary,
    },
  })
  export default styles;