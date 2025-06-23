import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { router } from 'expo-router';
import { useUser } from '@/hooks/useUser';
import styles from '@/styles/home.styles';
import { NotificationButton } from '@/components/common/NotificationButton';
import { ChatMessageButton } from '../common/ChatMessage';

interface HeaderProps {
  locationAddress: string | null;
}

export const Header = ({ locationAddress }: HeaderProps) => {
  const { user } = useUser();

  return (
    <View>
      <View style={styles.header}>
        <View style={styles.userInfoContainer}>
          <View style={styles.avatarWrapper}>
            {user?.avatarUrl ? (
              <Image
                source={{ uri: user?.avatarUrl }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="person-circle-outline" size={24} color={COLORS.primary} />
            )}
          </View>
          <Text style={styles.userNameText}>Hi, {user?.userName}</Text>
        </View>
        <View style={styles.headerIcons}>
          <View style={styles.iconContainer}>
            <NotificationButton />
          </View>
          <View style={styles.iconContainer}>
            <ChatMessageButton />
          </View>
        </View>
      </View>
      <View style={styles.locationContainer}>
        <Ionicons name="location-outline" size={18} color={COLORS.light} />
        <Text style={styles.locationText}>{locationAddress || 'Đang tìm vị trí...'}</Text>
      </View>
    </View>
  );
}; 