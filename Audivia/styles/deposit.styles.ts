import { StyleSheet } from "react-native";
import { COLORS } from "@/constants/theme";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F5F7FA",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLORS.primary,
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    backButton: {
      marginRight: 16,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: COLORS.light,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    amountInputContainer: {
      backgroundColor: COLORS.light,
      borderRadius: 12,
      padding: 20,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: "500",
      color: COLORS.dark,
      marginBottom: 12,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: COLORS.grey + "40",
      paddingBottom: 8,
    },
    amountInput: {
      flex: 1,
      fontSize: 24,
      fontWeight: "bold",
      color: COLORS.dark,
    },
    currencyLabel: {
      fontSize: 18,
      fontWeight: "500",
      color: COLORS.grey,
    },
    amountInWords: {
      marginTop: 12,
      fontSize: 16,
      color: COLORS.grey,
    },
    generateButton: {
      backgroundColor: COLORS.primary,
      borderRadius: 8,
      paddingVertical: 14,
      alignItems: "center",
      marginTop: 30,
    },
    generateButtonDisabled: {
      backgroundColor: COLORS.grey + "80",
    },
    generateButtonText: {
      color: COLORS.light,
      fontSize: 16,
      fontWeight: "600",
    },
    qrInfoContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.light,
      borderRadius: 12,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    infoText: {
      fontSize: 15,
      fontWeight: "600",
      color: COLORS.dark,
      marginBottom: 8,
    },
    linkText: {
      color: COLORS.primary,
      fontSize: 15,
      textDecorationLine: "underline",
      marginTop: 10,
    },
    qrAmount: {
      fontSize: 15,
      fontWeight: "bold",
      color: COLORS.primary,
      marginBottom: 24,
    },
    qrCodeContainer: {
      padding: 16,
      backgroundColor: COLORS.light,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.grey + "30",
      marginBottom: 24,
      height: 240,
      width: 240,
      alignItems: "center",
      justifyContent: "center",
    },
    qrInstructions: {
      fontSize: 14,
      color: COLORS.grey,
      textAlign: "center",
      marginBottom: 30,
      paddingHorizontal: 20,
    },
    cancelButton: {
      borderWidth: 1,
      borderColor: COLORS.primary,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 24,
    },
    cancelButtonText: {
      color: COLORS.primary,
      fontSize: 16,
      fontWeight: "500",
    },
    processingContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    processingText: {
      marginTop: 16,
      fontSize: 14,
      color: COLORS.dark,
      fontWeight: "500",
    },
    successContainer: {
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    successIconContainer: {
      marginBottom: 20,
    },
    successTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: COLORS.dark,
      marginBottom: 12,
    },
    successAmount: {
      fontSize: 28,
      fontWeight: "bold",
      color: COLORS.primary,
      marginBottom: 12,
    },
    successMessage: {
      fontSize: 16,
      color: COLORS.grey,
      textAlign: "center",
      marginBottom: 30,
    },
    completeButton: {
      backgroundColor: COLORS.primary,
      borderRadius: 8,
      paddingVertical: 14,
      paddingHorizontal: 40,
      alignItems: "center",
    },
    completeButtonText: {
      color: COLORS.light,
      fontSize: 16,
      fontWeight: "600",
    },
    vietQrContainer: {
      alignItems: 'center',
      marginTop: 20,
      backgroundColor: '#eaf4ff', // Light blue background
      padding: 20,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#b3d7ff', // Slightly darker blue border
      marginBottom: 20
    },
    vietQrInstructionText: {
      fontSize: 16,
      color: COLORS.dark,
      marginBottom: 12,
    },
    vietQrLogo: {
      width: 100,
      height: 40,
      resizeMode: 'contain',
      marginBottom: 6,
    },
    qrWrapperInner: {
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 8,
    //  marginBottom: 6,
    },
    napasMBLogos: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 11,
      marginTop: 0,
    },
    napasLogo: {
      width: 120,
      height: 120,
      resizeMode: 'contain',
      marginRight: 10,
    },
    bidvLogo: {
      width: 60,
      height: 80,
      resizeMode: 'contain',
    },
    bankInfoGrid: {
      width: '100%',
      marginBottom: 20,
    },
    infoLabel: {
      fontSize: 15,
      color: COLORS.grey,
      marginBottom: 8,
      width: '40%', // Allocate space for label
    },
    infoValue: {
      fontSize: 15,
      fontWeight: 'bold',
      color: COLORS.dark,
      marginBottom: 8,
      width: '60%', // Allocate space for value
    },
    sapoText: {
      fontSize: 12,
      color: COLORS.grey,
      marginBottom: 20,
    },
    printButton: {
      backgroundColor: '#f0f7ff',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 24,
    },
    printButtonText: {
      color: COLORS.primary,
      fontSize: 16,
      fontWeight: 'bold',
    },
  })
  export default styles;