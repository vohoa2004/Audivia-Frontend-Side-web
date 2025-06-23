import { StyleSheet } from "react-native";
import { COLORS } from "@/constants/theme";

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
    elevation: 2,
  },
  backButton: {
    padding: 4,
  },
  headerInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  headerStatus: {
    fontSize: 12,
    color: "#4CAF50",
  },
  headerButton: {
    padding: 4,
  },
  headerAction: {
    padding: 8,
    marginLeft: 5,
  },
  friendMessageBubble: {
    backgroundColor: "#e6e6e6",
    borderBottomLeftRadius: 5,
  },
  messageSender: {
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
    marginBottom: 3,
  },
  friendMessageContainer: {
    alignSelf: "flex-start",
    marginRight: "auto",
  },
  friendAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    alignSelf: "flex-end",
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  cameraButton: {
    padding: 5,
    marginLeft: 5,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 16,
    maxWidth: "80%",
  },
  botMessageContainer: {
    alignSelf: "flex-start",
  },
  userMessageContainer: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse",
  },
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    alignSelf: "flex-end",
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    maxWidth: "100%",
  },
  botMessageBubble: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  userMessageBubble: {
    backgroundColor: COLORS.primary,
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
    color: "#000",
  },
  userMessageText: {
    color: "#fff",
  },
  messageTime: {
    fontSize: 11,
    color: "#999",
    alignSelf: "flex-end",
  },
  messageTimeLight: {
    fontSize: 11,
    color: "#fff",
    alignSelf: "flex-end",
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginLeft: 16,
    marginBottom: 16,
  },
  typingAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  typingBubble: {
    flexDirection: "row",
    backgroundColor: "#E8E8E8",
    borderRadius: 18,
    padding: 12,
    width: 60,
    justifyContent: "space-between",
    borderTopLeftRadius: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#999",
  },
  quickQuestionsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
  },
  quickQuestionButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  quickQuestionText: {
    fontSize: 14,
    color: COLORS.primary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#EFEFEF",
  },
  attachButton: {
    padding: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 24,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    minHeight: 40,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
  },
  emojiButton: {
    padding: 4,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#DADADA",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonActive: {
    backgroundColor: COLORS.primary,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
});
