import { View, Text, Image, FlatList } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "@/constants/theme"
import { User } from "@/models"

interface ProfileFriendsProps {
  friends: User[]
}

export const ProfileFriends = ({ friends }: ProfileFriendsProps) => {
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 12 }}>Danh sách bạn bè</Text>
      {friends && friends.length > 0 ? (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
              {item.avatarUrl ? (
                <Image
                  source={{ uri: item.avatarUrl }}
                  style={{ width: 48, height: 48, borderRadius: 24, marginRight: 12, backgroundColor: '#eee' }}
                />
              ) : (
                <View style={{ width: 48, height: 48, borderRadius: 24, marginRight: 12, backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="person-outline" size={24} color={COLORS.primary} />
                </View>
              )}
              <Text style={{ fontSize: 16, fontWeight: "500" }}>{item.userName}</Text>
            </View>
          )}
          ListEmptyComponent={<Text>Chưa có bạn bè nào.</Text>}
          scrollEnabled={false}
        />
      ) : (
        <Text>Chưa có bạn bè nào.</Text>
      )}
    </View>
  )
} 