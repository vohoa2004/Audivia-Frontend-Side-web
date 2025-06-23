import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createMessage } from '@/services/chat';
import { useUser } from '@/hooks/useUser';
import { chatSignalRService } from '@/services/chat_signalR';
import { Message } from '@/models';
//import { styles } from "@/styles/chatbox.styles";

interface ChatInputProps {
  //onSend: (message: Message) => void;
  onTyping?: () => void;
  chatRoomId: string;
}

export const ChatInput = ({ onTyping, chatRoomId }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const { user } = useUser();

  const handleTyping = (text: string) => {
    setMessage(text);
    
    if (onTyping) {
      onTyping(); 
    }
  };

  const handleSend = async () => {
    if (message.trim() && user?.id) {
      try {
        // Tạo tin nhắn mới
        const newMessage: Message = {
          id: String(Date.now()),
          content: message.trim(),
          senderId: user.id,
          type: 'text',
          status: 'sent',
          chatRoomId: chatRoomId,
          createdAt: new Date(),
        };
        
        // Gửi tin nhắn qua API để lưu vào database
        // Server sẽ tự động gửi tin nhắn qua SignalR cho tất cả client trong phòng
        const response = await createMessage({
          content: message.trim(),
          senderId: user.id,
          chatRoomId: chatRoomId,
          type: 'text',
          status: 'sent'
        });

        // Cập nhật tin nhắn với ID từ server
        newMessage.id = response.id;
    //    onSend(newMessage);
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          placeholder="Nhập tin nhắn..."
          value={message}
          onChangeText={handleTyping}
          multiline
        />

        <TouchableOpacity style={styles.button}>
          <Ionicons name="happy-outline" size={24} color="#666666" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.sendButton, message.trim() ? styles.sendButtonActive : {}]}
        onPress={handleSend}
        disabled={!message.trim()}
      >
        <Ionicons 
          name="send" 
          size={20} 
          color={message.trim() ? '#FFFFFF' : '#999999'} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    marginRight: 8,
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    minHeight: 36,
    maxHeight: 100,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  button: {
    padding: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#007AFF',
  },
}); 