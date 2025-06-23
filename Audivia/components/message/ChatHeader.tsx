import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GroupAvatar } from './GroupAvatar';

export interface ChatHeaderProps {
  avatar?: string;
  title: string;
  isOnline?: boolean;
  onBack: () => void;
  members?: any[];
  type?: 'private' | 'group';
}

export const ChatHeader = ({
  avatar,
  title,
  isOnline,
  onBack,
  members = [],
  type = 'private'
}: ChatHeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        {type === 'group' ? (
          <GroupAvatar members={members} size={40} />
        ) : (
          avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>{(title !== undefined && title !== null) ? title.charAt(0) : ""}</Text>
            </View>
          )
        )}
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {isOnline && (
          <Text style={styles.status}>Đang hoạt động</Text>
        )}
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="call" size={24} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="videocam" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  titleSection: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 12,
    color: '#4CAF50',
  },
  rightSection: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
}); 