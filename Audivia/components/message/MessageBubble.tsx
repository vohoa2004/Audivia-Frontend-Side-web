import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Message } from '@/models';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  avatar?: string;
}

export const MessageBubble = ({ message, isOwnMessage, avatar }: MessageBubbleProps) => {
  return (
    <View
      style={[
        styles.container,
        isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer,
      ]}
    >
            {/* Chỉ hiển thị avatar nếu không phải tin nhắn của mình */}
      {!isOwnMessage && avatar && (
        <Image source={{ uri: avatar }} style={styles.avatar} />
      )}
      <View
        style={[
          styles.bubble,
          isOwnMessage ? styles.ownMessageBubble : styles.otherMessageBubble,
        ]}
      >
        <Text
          style={[
            styles.text,
            isOwnMessage ? styles.ownMessageText : styles.otherMessageText,
          ]}
        >
          {message.content}
        </Text>
        <Text style={styles.time}>
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    paddingHorizontal: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  ownMessageContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
  },
  bubble: {
    maxWidth: '75%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  ownMessageBubble: {
    backgroundColor: '#007AFF',
    borderTopRightRadius: 0,
  },
  otherMessageBubble: {
    backgroundColor: '#E8E8E8',
    borderTopLeftRadius: 0,
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
  },
  ownMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#000000',
  },
  time: {
    fontSize: 11,
    color: '#8E8E93',
    alignSelf: 'flex-end',
  },
});
