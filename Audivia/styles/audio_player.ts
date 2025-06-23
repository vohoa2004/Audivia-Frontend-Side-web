import { COLORS } from "@/constants/theme";
import { StyleSheet

 } from "react-native";
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F5F7FA",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
  //    paddingTop: 15,
   ///   paddingHorizontal: 16,
      padding: 7
    //  paddingBottom: 16,
    //  height: 100,
   //   backgroundColor: COLORS.primary,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      flex: 1,
      alignItems: "center",
    },
    headerText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#fff",
    },
    menuButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    audioImageContainer: {
      width: "100%",
      height: 200,
      position: "relative",
    },
    audioImage: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    imageGradient: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    audioInfo: {
      position: "absolute",
      bottom: 16,
      left: 16,
      right: 16,
    },
    audioTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#fff",
      marginBottom: 4,
    },
    audioSpeaker: {
      fontSize: 14,
      color: "#fff",
      opacity: 0.8,
    },
    playerContainer: {
      backgroundColor: COLORS.white,
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.grey,
    },
    progressContainer: {
      marginBottom: 16,
    },
    progressBar: {
      height: 4,
      backgroundColor: "#E0E0E0",
      borderRadius: 2,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: COLORS.primary,
      borderRadius: 2,
    },
    timeContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 8,
    },
    timeText: {
      fontSize: 12,
      color: COLORS.darkGrey,
    },
    controlsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
    },
    controlButton: {
      width: 50,
      height: 50,
      justifyContent: "center",
      alignItems: "center",
    },
    playPauseButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: COLORS.primary,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 20,
    },
    speedContainer: {
      alignItems: "center",
    },
    speedButton: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 16,
      backgroundColor: "#F0F0F0",
    },
    speedText: {
      fontSize: 12,
      fontWeight: "500",
    },
    transcriptContainer: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    transcriptHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 0.5,
      borderBottomColor: COLORS.grey,
    },
    transcriptTitle: {
      fontSize: 18,
      fontWeight: "bold",
    },
    transcriptButton: {
      flexDirection: "row",
      alignItems: "center",
    },
    transcriptButtonText: {
      fontSize: 14,
      color: COLORS.primary,
      marginLeft: 4,
    },
    transcriptScroll: {
      flex: 1,
    },
    transcriptItem: {
      padding: 16,
      borderBottomWidth: 0.5,
      borderBottomColor: COLORS.grey,
      position: "relative",
    },
    activeTranscriptItem: {
      backgroundColor: COLORS.purpleLight,
      borderLeftWidth: 3,
      borderLeftColor: COLORS.primary,
    },
    transcriptText: {
      fontSize: 15,
      lineHeight: 22,
      color: COLORS.grey,
      paddingRight: 40,
    },
    activeTranscriptText: {
      color: COLORS.darkGrey,
      fontWeight: "500",
    },
    transcriptTime: {
      position: "absolute",
      right: 16,
      top: 16,
      fontSize: 12,
      color: COLORS.dark,
      backgroundColor: "#F0F0F0",
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 10,
    },
  })
  export default styles 