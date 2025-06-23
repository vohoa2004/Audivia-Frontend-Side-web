import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import styles from "@/styles/message_inbox";
import { Header } from "@/components/message/Header";
import { useUser } from "@/hooks/useUser";
import { createChatRoom, createChatRoomMember, getChatRoomsByUserId, getPrivateRoom, getMessagesByChatRoom } from "@/services/chat";
import { CreateGroupModal } from "@/components/message/CreateGroupModal";
import { getUserFriends } from "@/services/user_follow";
import { GroupAvatar } from "@/components/message/GroupAvatar";
import { SearchButton } from "@/components/common/SearchButton";



export default function MessagingInboxScreen() {
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  // Hàm fetch data chat rooms
  const fetchChatRooms = async () => {
    if (!user?.id) {
      console.log("Waiting for user data...");
      return;
    }

    setLoading(true);
    try {
      const data = await getChatRoomsByUserId(user.id);

      const mappedData = await Promise.all(data.map(async (room: any) => {
        let friendAvatar = "";
        let friendName = "";

        if (room.type === "private") {
          const friend = room.members.find((m: any) => m.userId !== user.id);
          friendAvatar = friend?.user?.avatarUrl || "";
          friendName = friend?.user?.fullName || friend?.user?.username || room.name;
        }

        // Lấy tin nhắn cuối cùng của phòng chat
        const messages = await getMessagesByChatRoom(room.id);
        const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

        return {
          id: room.id,
          name: room.type === "private" ? friendName : room.name,
          type: room.type,
          lastMessage: lastMessage ? lastMessage.content : "Chưa có tin nhắn",
          time: lastMessage ? new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
          unread: 0,
          avatar: room.type === "private" ? friendAvatar : null,
          members: room.members,
        };
      }));

      setChatRooms(mappedData);
    } catch (error) {
      console.error("Fetch chat rooms error:", error);
      // Thêm thông báo lỗi cho người dùng
      Alert.alert("Lỗi", "Không thể tải danh sách chat. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Hàm fetch danh sách bạn bè
  const fetchFriends = async () => {
    if (!user?.id) {
      console.log("Waiting for user data...");
      return;
    }

    try {
      const response = await getUserFriends(user.id);
      setFriends(response.response);
    } catch (error) {
      console.error("Fetch friends error:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách bạn bè. Vui lòng thử lại.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        fetchChatRooms();
        fetchFriends();
      }
    }, [user?.id])
  );

  // Hàm fetch tin nhắn cuối cùng cho một phòng chat
  const fetchLastMessage = async (chatRoomId: string) => {
    try {
      const messages = await getMessagesByChatRoom(chatRoomId);
      const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

      setChatRooms(prev => {
        return prev.map(room => {
          if (room.id === chatRoomId) {
            return {
              ...room,
              lastMessage: lastMessage ? lastMessage.content : "Chưa có tin nhắn",
              time: lastMessage ? new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""
            };
          }
          return room;
        });
      });
    } catch (error) {
      console.error("Error fetching last message:", error);
    }
  };

  // Lọc theo search
  const filteredConversations = chatRooms.filter((conversation) =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFriends = friends.filter((friend) =>
    (friend.fullName?.toLowerCase() ?? '').includes(searchQuery.toLowerCase()) ||
    friend.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const goBack = () => router.back();

  const navigateToChat = (conversationId: string) => {
    router.push(`/message_detail?id=${conversationId}`);
  };

  // Hàm tạo chat room với bạn bè
  const createChatWithFriend = async (friendId: string) => {
    try {
      // Kiểm tra xem đã có chat room giữa 2 người chưa
      const existingRoom = await getPrivateRoom(user?.id as string, friendId);

      if (existingRoom) {
        // Nếu đã có chat room thì chuyển đến message detail
        navigateToChat(existingRoom.id);
      } else {
        // Nếu chưa có thì tạo mới chat room
        const newChatRoom = await createChatRoom({
          name: "Chat riêng tư",
          createdBy: user?.id as string,
          type: "private",
        });

        // thêm bạn vào là member
        var rs = await createChatRoomMember({
          chatRoomId: newChatRoom.id,
          isHost: true,
          nickname: "",
          userId: user?.id as string
        });


        // thêm bạn bè vào là member
        await createChatRoomMember({
          chatRoomId: newChatRoom.id,
          isHost: false,
          nickname: "",
          userId: friendId
        });

        if (newChatRoom) {
          navigateToChat(newChatRoom.id);
        }
      }
    } catch (error) {
      console.error("Create chat room error:", error);
    }
  };

  // Render item đơn giản cho chat rooms
  const renderConversationItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        onPress={() => navigateToChat(item.id)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          borderBottomWidth: 0.5,
          borderColor: "#ddd",
        }}
      >
        {item.type === "group" ? (
          <GroupAvatar members={item.members} size={40} />
        ) : item.avatar ? (
          <Image
            source={{ uri: item.avatar }}
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
          />
        ) : (
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#007AFF",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
              {item.name.charAt(0).toUpperCase() || ""}
            </Text>
          </View>
        )}
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.name}</Text>
          <Text style={{ color: "#555" }}>{item.lastMessage}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Render item cho danh sách bạn bè
  const renderFriendItem = ({ item }: { item: any }) => {
    console.warn(item);

    return (
      <TouchableOpacity
        onPress={() => createChatWithFriend(item.id)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          borderBottomWidth: 0.5,
          borderColor: "#ddd",
        }}
      >
        {item.avatarUrl ? (
          <Image
            source={{ uri: item.avatarUrl }}
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
          />
        ) : (
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#007AFF",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
              {item.userName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.fullName || item.userName}</Text>
          <Text style={{ color: "#555" }}>@{item.userName}</Text>
        </View>
      </TouchableOpacity>
    );
  };



  const createGroup = async (name: string, selectedUsers: any[]) => {
    if (name.trim() && selectedUsers.length >= 2) {
      try {
        // Tạo phòng chat mới
        const newChatRoom = await createChatRoom({
          name: name.trim(),
          createdBy: user?.id as string,
          type: "group",
        });

        // Thêm người tạo vào phòng với quyền host
        await createChatRoomMember({
          chatRoomId: newChatRoom.id,
          isHost: true,
          nickname: "",
          userId: user?.id as string
        });

        // Thêm tất cả thành viên được chọn vào phòng
        for (const member of selectedUsers) {
          await createChatRoomMember({
            chatRoomId: newChatRoom.id,
            isHost: false,
            nickname: "",
            userId: member.id
          });
        }

        // Đóng modal và reset form
        setShowCreateGroup(false);
        setSelectedUsers([]);
        setGroupName("");

        // Refresh danh sách phòng chat
        await fetchChatRooms();

        // Chuyển đến phòng chat mới
        navigateToChat(newChatRoom.id);

      } catch (error) {
        console.error("Create group chat error:", error);
        alert("Có lỗi xảy ra khi tạo nhóm chat!");
      }
    } else {
      alert("Vui lòng nhập tên nhóm và chọn ít nhất 2 thành viên!");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {!showSearch ? (
        <Header onBack={goBack} onSearch={() => setShowSearch(true)} />
      ) : (
        <SearchButton
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onBack={() => setShowSearch(false)}
        />
      )}

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <>
          {/* Danh sách bạn bè */}
          <View style={{ padding: 10 }}>
            <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>Bạn bè</Text>
            <FlatList
              data={filteredFriends}
              renderItem={renderFriendItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 20 }}
            />
          </View>

          {/* Danh sách chat rooms */}
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: "bold", fontSize: 18, marginLeft: 10, marginBottom: 10 }}>Tin nhắn</Text>
            {filteredConversations.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="chatbubble-ellipses-outline" size={60} color="#ccc" />
                <Text style={styles.emptyText}>Không tìm thấy cuộc trò chuyện</Text>
              </View>
            ) : (
              <FlatList
                data={filteredConversations}
                renderItem={renderConversationItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.conversationsList}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </>
      )}

      <View style={styles.floatingButtonsContainer}>
        <TouchableOpacity
          style={styles.createGroupButton}
          onPress={() => setShowCreateGroup(true)}
        >
          <Ionicons name="people" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <CreateGroupModal
        visible={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
        onCreateGroup={createGroup}
      />
    </SafeAreaView>
  );
}
