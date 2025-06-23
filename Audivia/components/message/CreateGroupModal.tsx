import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@/hooks/useUser';
import { getUserFriends } from '@/services/user_follow';

interface CreateGroupModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateGroup: (name: string, selectedUsers: any[]) => void;
}

export const CreateGroupModal = ({ visible, onClose, onCreateGroup }: CreateGroupModalProps) => {
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const { user } = useUser();

  // Load danh sách bạn bè khi modal mở
  React.useEffect(() => {
    if (visible) {
      loadFriends();
    }
  }, [visible]);

  const loadFriends = async () => {
    try {
      const response = await getUserFriends(user?.id as string);
      setFriends(response.response);
    } catch (error) {
      console.error('Error loading friends:', error);
    }
  };

  const toggleUserSelection = (user: any) => {
    if (selectedUsers.some(selected => selected.id === user.id)) {
      setSelectedUsers(selectedUsers.filter(selected => selected.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleCreateGroup = () => {
    if (groupName.trim() && selectedUsers.length >= 2) {
      onCreateGroup(groupName.trim(), selectedUsers);
    } else {
      alert('Vui lòng nhập tên nhóm và chọn ít nhất 2 thành viên!');
    }
  };

  const renderFriendItem = ({ item }: { item: any }) => {
    const isSelected = selectedUsers.some(selected => selected.id === item.id);

    return (
      <TouchableOpacity
        style={[styles.friendItem, isSelected && styles.selectedFriendItem]}
        onPress={() => toggleUserSelection(item)}
      >
        {item.avatarUrl ? (
          <Image
            source={{ uri: item.avatarUrl }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>
              {item.userName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.friendInfo}>
          <Text style={styles.friendName}>{item.fullName || item.userName}</Text>
          <Text style={styles.friendUsername}>@{item.userName}</Text>
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.title}>Tạo nhóm chat mới</Text>
            <TouchableOpacity
              onPress={handleCreateGroup}
              style={[
                styles.createButton,
                (!groupName.trim() || selectedUsers.length < 2) && styles.createButtonDisabled
              ]}
              disabled={!groupName.trim() || selectedUsers.length < 2}
            >
              <Text style={styles.createButtonText}>Tạo</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Nhập tên nhóm"
            value={groupName}
            onChangeText={setGroupName}
          />

          <Text style={styles.sectionTitle}>Chọn thành viên ({selectedUsers.length})</Text>
          
          <FlatList
            data={friends}
            renderItem={renderFriendItem}
            keyExtractor={item => item.id}
            style={styles.friendsList}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonDisabled: {
    backgroundColor: '#ccc',
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  friendsList: {
    flex: 1,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedFriendItem: {
    backgroundColor: '#f0f8ff',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
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
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '500',
  },
  friendUsername: {
    fontSize: 14,
    color: '#666',
  },
}); 