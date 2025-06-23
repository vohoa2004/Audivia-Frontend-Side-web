import { useState, useRef, useEffect, useCallback } from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { COLORS } from "@/constants/theme"
import { styles } from "@/styles/chatbox.styles"
import { sendChatMessage, getChatHistory, ChatBotMessage as ApiChatMessage } from "@/services/chatbot"
import { useUser } from "@/hooks/useUser"
import AsyncStorage from "@react-native-async-storage/async-storage"

const CLIENT_SESSION_ID_KEY = "chatClientSessionId"

const generateGUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// Moved outside component as it doesn't depend on component state
const mapApiMessageToUIMessage = (apiMsg: ApiChatMessage): UIMessage => {
  return {
    id: apiMsg.id || generateGUID(),
    text: apiMsg.reply,
    time: apiMsg.timestamp,
    isBot: apiMsg.sender === 1,
  }
}

interface UIMessage {
  id: string
  text: string
  time: string
  isBot: boolean
  // isNew: boolean // May not be needed if FlatList manages new item rendering
}

const PAGE_SIZE = 20

export default function ChatScreen() {
  const { user } = useUser()
  const [messages, setMessages] = useState<UIMessage[]>([])
  const [inputText, setInputText] = useState("")
  const flatListRef = useRef<FlatList<any>>(null)
  const router = useRouter()

  const [clientSessionId, setClientSessionId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMoreHistory, setHasMoreHistory] = useState(true)

  // Effect to initialize clientSessionId and userId
  useEffect(() => {
    const initSession = async () => {
      let sessionId = await AsyncStorage.getItem(CLIENT_SESSION_ID_KEY)
      if (!sessionId) {
        sessionId = generateGUID()
        await AsyncStorage.setItem(CLIENT_SESSION_ID_KEY, sessionId)
      }
      setClientSessionId(sessionId)
    }
    initSession()

    if (user?.id) {
      setUserId(user.id)
    }
  }, [user])

  const loadChatHistory = useCallback(async (page: number, initialLoad = false) => {
    if (!clientSessionId || !hasMoreHistory || isLoadingMore || (initialLoad && isLoadingHistory)) return

    if (initialLoad) setIsLoadingHistory(true)
    else setIsLoadingMore(true)

    try {
      const history = await getChatHistory(clientSessionId, page, PAGE_SIZE)
      const uiMessages = history.map(msg => mapApiMessageToUIMessage(msg)).reverse()

      setMessages(prevMessages => page === 1 ? uiMessages : [...uiMessages, ...prevMessages])

      if (history.length < PAGE_SIZE) {
        setHasMoreHistory(false)
      }
      setCurrentPage(page)

    } catch (error) {
      console.error("Failed to load chat history:", error)
    } finally {
      if (initialLoad) setIsLoadingHistory(false)
      else setIsLoadingMore(false)
    }
  }, [clientSessionId, hasMoreHistory, isLoadingMore, isLoadingHistory])

  // Effect to load initial chat history
  useEffect(() => {
    if (clientSessionId && userId) {
      loadChatHistory(1, true)
    }
  }, [clientSessionId, userId, loadChatHistory])

  const handleSendMessage = useCallback(async () => {
    if (inputText.trim() === "" || !clientSessionId || !userId || isSendingMessage) return

    setIsSendingMessage(true)

    const userMessageText = inputText
    const tempUserMessageId = generateGUID()

    const newUserMessage: UIMessage = {
      id: tempUserMessageId,
      text: userMessageText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isBot: false,
    }
    setMessages(prevMessages => [newUserMessage, ...prevMessages])
    setInputText("")

    try {
      const botReply = await sendChatMessage(userMessageText, clientSessionId, userId)
      const newBotMessage = mapApiMessageToUIMessage(botReply)

      setMessages(prevMessages => {
        return [newBotMessage, ...prevMessages]
      })

    } catch (error) {
      console.error("Failed to send message or get bot reply:", error)
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== tempUserMessageId))
      setInputText(userMessageText)
    } finally {
      setIsSendingMessage(false)
    }
  }, [inputText, clientSessionId, userId, isSendingMessage])

  const loadMoreMessages = useCallback(() => {
    if (hasMoreHistory && !isLoadingMore && clientSessionId) {
      loadChatHistory(currentPage + 1)
    }
  }, [hasMoreHistory, isLoadingMore, clientSessionId, currentPage, loadChatHistory])

  const renderMessage = useCallback(({ item }: { item: UIMessage }) => {
    return (
      <View
        style={[
          styles.messageContainer,
          item.isBot ? styles.botMessageContainer : styles.userMessageContainer,
        ]}
      >
        {item.isBot && (
          <Image source={require("@/assets/images/logo.png")} style={styles.botAvatar} />
        )}
        <View style={[styles.messageBubble, item.isBot ? styles.botMessageBubble : styles.userMessageBubble]}>
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={item.isBot ? styles.messageTime : styles.messageTimeLight}>{item.time}</Text>
        </View>
      </View>
    )
  }, [])

  const goBack = useCallback(() => {
    router.back()
  }, [router])

  // Auto-scroll to bottom (or top for inverted FlatList) when new messages are added
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => flatListRef.current?.scrollToOffset({ animated: true, offset: 0 }), 100)
    }
  }, [messages])

  if (isLoadingHistory && messages.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.headerInfo}><Text style={styles.headerName}>Audy - Trợ lý du lịch</Text></View>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text>Đang tải cuộc trò chuyện...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.headerAvatar}
          />
          <View>
            <Text style={styles.headerName}>Audy - Trợ lý du lịch</Text>
          </View>
        </View>
      </View>

      {/* Chat Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        inverted
        onEndReached={loadMoreMessages}
        onEndReachedThreshold={0.5}
        initialNumToRender={PAGE_SIZE}
        maxToRenderPerBatch={PAGE_SIZE}
        windowSize={10}
        removeClippedSubviews={true}
        ListHeaderComponent={
          isLoadingMore ? <ActivityIndicator style={{ marginVertical: 10 }} size="small" color={COLORS.primary} /> : null
        }
      />

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 30}
        style={styles.inputContainer}
      >
        <TouchableOpacity style={styles.attachButton}>
          <Ionicons name="add-circle-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Nhập tin nhắn..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            editable={!isSendingMessage}
          />
          <TouchableOpacity style={styles.emojiButton}>
            <Ionicons name="happy-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.sendButton, (inputText.trim() && !isSendingMessage) ? styles.sendButtonActive : {}]}
          onPress={handleSendMessage}
          disabled={!inputText.trim() || isSendingMessage}
        >
          {isSendingMessage ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="send" size={20} color={(inputText.trim() && !isSendingMessage) ? "#fff" : "#999"} />
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

