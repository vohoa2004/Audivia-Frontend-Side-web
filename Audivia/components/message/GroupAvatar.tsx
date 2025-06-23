import React from 'react';
import { View, Image, StyleSheet, Dimensions, Text } from 'react-native';

interface GroupAvatarProps {
  members: any[];
  size?: number;
}

export const GroupAvatar = ({ members, size = 40 }: GroupAvatarProps) => {
  // Lấy tối đa 4 thành viên đầu tiên để hiển thị
  const displayMembers = members.slice(0, 4);
  const avatarSize = size / 2;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {displayMembers.map((member, index) => {
        const position = getPosition(index, size);
        return (
          <View
            key={member.userId}
            style={[
              styles.avatarContainer,
              {
                width: avatarSize,
                height: avatarSize,
                left: position.x,
                top: position.y,
              },
            ]}
          >
            {member.user?.avatarUrl ? (
              <Image
                source={{ uri: member.user.avatarUrl }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarText}>
                  {member.user?.fullName?.charAt(0) || member.user?.userName?.charAt(0) || '?'}
                </Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

const getPosition = (index: number, size: number) => {
  const positions = [
    { x: 0, y: 0 }, // Top left
    { x: size / 2, y: 0 }, // Top right
    { x: 0, y: size / 2 }, // Bottom left
    { x: size / 2, y: size / 2 }, // Bottom right
  ];
  return positions[index] || positions[0];
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    overflow: 'hidden',
  },
  avatarContainer: {
    position: 'absolute',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
}); 