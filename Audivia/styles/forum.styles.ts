import { COLORS } from "@/constants/theme"
import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.blueLight,
    paddingBottom: 60
  },
  

  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.dark
  },
  tab: {
    paddingVertical: 12,
    marginRight: 24,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  tabText: {
    fontSize: 16,
    color: "#999",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "600",
  },
  
  whatsOnYourMindContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  whatsOnYourMindContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  whatsOnYourMindAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  whatsOnYourMindInput: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  whatsOnYourMindText: {
    color: "#666",
  },
  postWrapper: {
    paddingHorizontal: 16,
  },
  postContainer: {
    backgroundColor: COLORS.light,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontWeight: "600",
    fontSize: 14,
  },
  location: {
    fontSize: 12,
    color: "#666",
  },
  postImageContainer: {
    width: "100%",
    height: 200
  },
  postImage: {
    width: "100%",
    height: "100%",
    borderRadius:12
  },
  postActions: {
    flexDirection: "row",
    paddingVertical: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftActions: {
    flexDirection: "row",
    alignItems: 'center',
  },
  actionButton: {
    marginRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    color: COLORS.dark,
    marginLeft: 4,
  },
  postStats: {
    marginBottom: 6,
  },
  likes: {
    fontWeight: "600",
    fontSize: 14,
  },
  postContent: {
    marginBottom: 8,
  },
  postText: {
    fontSize: 14,
    lineHeight: 20,
  },
  commentsLink: {
    marginBottom: 4,
  },
  commentsText: {
    color: "#999",
    fontSize: 14,
  },
  timeText: {
    color: "#999",
    fontSize: 12,
    marginBottom: 8,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
  },
  commentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
  },
  postButton: {
    color: COLORS.primary,
    fontWeight: "bold",
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
  commentsSection: {
    marginTop: 8,
    paddingHorizontal: 15,
  },
  commentItem: {
    flexDirection: "row",
    marginBottom: 4,
  },
  commentUser: {
    fontWeight: "bold",
    marginRight: 5,
  },
  commentText: {
    flex: 1,
  },
  // Styles for Comments Modal
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalCommentItem: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
    width: '100%',
  },
  modalCommentUser: {
    fontWeight: "bold",
    marginRight: 8,
    color: COLORS.dark, // Or your preferred color
  },
  modalCommentText: {
    flex: 1,
    color: COLORS.darkGrey, // Or your preferred color
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  buttonClose: {
    backgroundColor: COLORS.primary,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
})
