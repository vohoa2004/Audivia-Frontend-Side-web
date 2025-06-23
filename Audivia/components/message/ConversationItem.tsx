import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "@/styles/message_inbox";

interface ConversationItemProps {
  item: {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unread: number;
    isGroup: boolean;
    isOnline?: boolean;
    members?: string[];
  };
  onPress: (id: string) => void;
}

export const ConversationItem = ({ item, onPress }: ConversationItemProps) => {
  return (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => onPress(item.id)}
    >
      <View style={styles.conversationAvatarContainer}>
        {item.isGroup ? (
          <View style={styles.groupAvatarContainer}>
            <Image
              source={{ uri: item.avatar }}
              style={styles.conversationAvatar}
            />
            <View style={styles.groupIconBadge}>
              <Ionicons name="people" size={12} color="#fff" />
            </View>
          </View>
        ) : (
          <View>
            <Image
              source={{ uri: item.avatar }}
              style={styles.conversationAvatar}
            />
            {item.isOnline && (
              <View style={styles.conversationOnlineIndicator} />
            )}
          </View>
        )}
      </View>

      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text
            style={[
              styles.conversationName,
              item.unread > 0 && styles.unreadName,
            ]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text
            style={[
              styles.conversationTime,
              item.unread > 0 && styles.unreadTime,
            ]}
          >
            {item.time}
          </Text>
        </View>

        <View style={styles.conversationFooter}>
          <Text
            style={[
              styles.conversationLastMessage,
              item.unread > 0 && styles.unreadMessage,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{item.unread}</Text>
            </View>
          )}
        </View>

        {item.isGroup && item.members && (
          <View style={styles.groupMembersContainer}>
            {item.members.slice(0, 3).map((member, index) => (
              <View
                key={index}
                style={[styles.groupMemberBadge, { marginLeft: index * -8 }]}
              >
                <Text style={styles.groupMemberText}>{member.charAt(0)}</Text>
              </View>
            ))}
            {item.members.length > 3 && (
              <Text style={styles.groupMembersMore}>
                +{item.members.length - 3}
              </Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}; 