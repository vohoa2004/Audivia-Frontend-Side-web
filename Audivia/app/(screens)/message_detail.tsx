import React, { useState, useRef, useEffect } from "react";
import {
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { styles } from "@/styles/chatbox.styles";
import { ChatHeader } from "@/components/message/ChatHeader";
import { MessageBubble } from "@/components/message/MessageBubble";
import { TypingIndicator } from "@/components/message/TypingIndicator";
import { ChatInput } from "@/components/message/ChatInput";
import { getChatRoomById, getMessagesByChatRoom } from "@/services/chat"; // <-- Import API
//import { getChatRoomById } from "@/services/chat"; // <-- Nếu muốn lấy thêm info phòng chat
import { useUser } from "@/hooks/useUser";
//import { chatSignalRService } from "@/services/chat_signalR";
import { Message } from "@/models";

export default function MessageDetailScreen() {
  const { id: chatRoomId } = useLocalSearchParams(); // <-- Lấy id từ route
  const router = useRouter();
  const { user } = useUser();
  const currentUserId = user?.id;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [chatRoom, setChatRoom] = useState<any>(null); // Optional: để lấy tên, avatar
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  const flatListRef = useRef<FlatList<any>>(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;

  const scrollToBottom = () => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      if (flatListRef.current && messages.length > 0) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
  };

  useEffect(() => {
    if (!chatRoomId || typeof chatRoomId !== "string") return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const [msgs, room] = await Promise.all([
          getMessagesByChatRoom(chatRoomId),
          getChatRoomById(chatRoomId),
        ]);

        setMessages(msgs);
        setChatRoom(room);
        scrollToBottom();
      } catch (error) {
        console.error("Lỗi khi tải tin nhắn:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatRoomId]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  /*
  useEffect(() => {
    if (!chatRoomId) return;

    // Tham gia vào phòng chat khi component mount
    console.log(`${user?.fullName} Joining chat room:`, chatRoomId);
    chatSignalRService.joinRoom(chatRoomId as string)
      .then(() => console.log('Successfully joined room:', chatRoomId))
      .catch(error => console.error('Error joining room:', error));

    const handleReceiveMessage = (message: any) => {
      console.log("Received message:", message);
      const actualMessage = message.response;
      
      // Chỉ xử lý tin nhắn của phòng chat hiện tại
      if (String(actualMessage.chatRoomId) === String(chatRoomId)) {
        console.log('Adding message to state:', actualMessage);
        setMessages(prev => {
          const messageExists = prev.some(msg => msg.id === actualMessage.id);
          if (messageExists) {
            console.log('Message already exists in state');
            return prev;
          }
          return [...prev, actualMessage];
        });
      }
    };

    const handleUpdateMessage = (message: Message) => {
      if (message.chatRoomId === chatRoomId) {
        setMessages(prev => prev.map(msg => 
          msg.id === message.id ? message : msg
        ));
      }
    };

    const handleDeleteMessage = (message: Message) => {
      if (message.chatRoomId === chatRoomId) {
        setMessages(prev => prev.filter(msg => msg.id !== message.id));
      }
    };

    const handleUserTyping = (data: { userId: string, chatRoomId: string }) => {
        if (data.chatRoomId === chatRoomId && data.userId !== currentUserId) {
        setTypingUsers(prev =>
        {
          const newSet = new Set(prev);
          newSet.add(data.userId);
          return newSet;
        });
        
        // Tự động xóa typing status sau 3 giây
        setTimeout(() => {
          setTypingUsers(prev => {
            const newSet = new Set(prev);
            newSet.delete(data.userId);
            return newSet;
          });
        }, 3000);
      }
    };

    // Đăng ký các event handlers
    chatSignalRService.onReceiveMessage(handleReceiveMessage);
    chatSignalRService.onMessageUpdated(handleUpdateMessage);
    chatSignalRService.onMessageDeleted(handleDeleteMessage);
    chatSignalRService.onUserTyping(handleUserTyping);

    // Cleanup khi unmount
    return () => {
      chatSignalRService.leaveRoom(chatRoomId as string);
      chatSignalRService.removeMessageCallback(handleReceiveMessage);
      chatSignalRService.removeMessageUpdatedCallback(handleUpdateMessage);
      chatSignalRService.removeMessageDeletedCallback(handleDeleteMessage);
      chatSignalRService.removeTypingCallback(handleUserTyping);
    };
  }, [chatRoomId]);
  */

  const goBack = () => {
    router.back();
  };



  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ChatHeader
        type={chatRoom?.type}
        avatar={
          chatRoom?.type === "private"
            ? chatRoom?.members?.find((m: any) => m.userId !== currentUserId)?.user?.avatarUrl
            : undefined
        }
        title={
          chatRoom?.type === "private"
            ? chatRoom?.members?.find((m: any) => m.userId !== currentUserId)?.user?.fullName ??
            chatRoom?.members?.find((m: any) => m.userId !== currentUserId)?.user?.userName
            : chatRoom?.name
        }
        isOnline={true}
        onBack={goBack}
        members={chatRoom?.type === "group" ? chatRoom?.members : undefined}
      />

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => {
          const isOwnMessage = String(item.senderId) === String(currentUserId);
          const senderMember = chatRoom?.members?.find((m: any) => String(m.userId) === String(item.senderId));
          const avatar = senderMember?.user?.avatarUrl || null;
          const senderName = senderMember?.user?.fullName || senderMember?.user?.username || item.senderName;
          
          return (
            <MessageBubble
              message={{
                ...item,
                senderName: chatRoom?.type === "group" ? senderName : item.senderName
              }}
              isOwnMessage={isOwnMessage}
              avatar={!isOwnMessage ? avatar : null}
            />
          )
        }}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={scrollToBottom}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10
        }}
      />

      {typingUsers.size > 0 && (
        <TypingIndicator
          avatar={chatRoom?.members?.find((m: any) => m.userId === Array.from(typingUsers)[0])?.user?.avatarUrl}
          animation={typingAnimation}
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ChatInput
         // onSend={sendMessage}
          onTyping={async () => {
            // try {
            //   await chatSignalRService.sendTypingStatus(chatRoomId as string, user?.id as string);
            // } catch (error) {
            //   console.error('Error sending typing status:', error);
            // }
          }}
          chatRoomId={chatRoomId as string}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
