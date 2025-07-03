import { COLORS } from "@/constants/theme";
import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.light,
      paddingBottom: 20
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: COLORS.dark,
    },
    headerIcons: {
        flexDirection: "row",
      },
      iconButton: {
        marginLeft: 20,
    },
    notification: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FFF8EE",
      marginHorizontal: 16,
      marginTop: 16,
      marginBottom: 8,
      borderRadius: 12,
      padding: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    notificationContent: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
    },
    notificationIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#FFF0E0",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    notificationTextContainer: {
      flex: 1,
    },
    notificationTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#FF6B00",
    },
    notificationMessage: {
      fontSize: 14,
      color: "#666",
      marginTop: 2,
    },
    notificationImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginLeft: 12,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: "#333",
    },
    tourList: {
      flex: 1,
      paddingBottom: 20,
    },
    tourCard: {
      backgroundColor: "#fff",
      borderRadius: 16,
      marginBottom: 16,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    tourImage: {
      width: "100%",
      height: 180,
    },
    tourContent: {
      padding: 16,
    },
    tourHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    tourName: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 4,
      width: 250
    },
    tourLocation: {
      fontSize: 14,
      color: "#666",
    },
    tourRating: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#F8F9FA",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    ratingText: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#333",
      marginLeft: 4,
    },
    tourFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    postOptions: {
      position: 'absolute',
      top: 40,
      right: 10,
      backgroundColor: COLORS.light,
      borderRadius: 8,
      padding: 8,
      shadowColor: COLORS.dark,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      zIndex: 1000,
    },
    postOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
      gap: 8,
    },
    postOptionText: {
      fontSize: 14,
      color: COLORS.dark,
    },
    savedTime: {
      fontSize: 14,
      color: "#666",
    },
    tourActions: {
      flexDirection: "row",
    },
    actionButton: {
      marginLeft: 8,
    },
    actionButtonInner: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
    },
    scheduleButton: {
      backgroundColor: COLORS.primary,
    },
    favoriteButton: {
      backgroundColor: COLORS.red,
    },
    bottomNav: {
      flexDirection: "row",
      backgroundColor: "#fff",
      paddingTop: 8,
      paddingBottom: 24,
      borderTopWidth: 1,
      borderTopColor: "#E4E6EB",
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
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
      color: "#FF6B6B",
    },
    icon: {
        marginRight: 16,
      },
      avatarWrapper: {
        width: 32,
        height: 32,
        borderRadius: 21,
        overflow: "hidden",
        backgroundColor: COLORS.grey,
        alignItems: "center",
        justifyContent: "center",
      },
      
      avatarImage: {
        width: "100%",
        height: "100%",
      },
  })
  export default styles;