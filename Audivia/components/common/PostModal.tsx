import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '@/constants/theme';
import { LocationPicker } from './LocationPicker';
import { Post } from '@/models';

interface PostModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (post: { content: string; location: string; images: string[] }) => void;
  editingPost?: Post | null;
}

export const PostModal: React.FC<PostModalProps> = ({
  visible,
  onClose,
  onSave,
  editingPost,
}) => {
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  useEffect(() => {
    if (editingPost) {
      setContent(editingPost.content);
      setLocation(editingPost.location);
      setImages(editingPost.images || []);
    } else {
      setContent('');
      setLocation('');
      setImages([]);
    }
  }, [editingPost]);

  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Cần quyền truy cập', 'Vui lòng cho phép ứng dụng truy cập thư viện ảnh');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setImages([...images, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại.');
    }
  };

  const handleSave = () => {
    if (!content.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập nội dung bài viết');
      return;
    }
    onSave({ content, location, images });
    setContent('');
    setLocation('');
    setImages([]);
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color={COLORS.dark} />
              </TouchableOpacity>
              <Text style={styles.title}>
                {editingPost ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
              </Text>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                disabled={!content.trim()}
              >
                <Text style={[
                  styles.saveButtonText,
                  !content.trim() && styles.saveButtonTextDisabled
                ]}>
                  Đăng
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.body}>
              <TextInput
                style={styles.contentInput}
                placeholder="Bạn đang nghĩ gì?"
                placeholderTextColor={COLORS.grey}
                multiline
                value={content}
                onChangeText={setContent}
              />

              <TouchableOpacity
                style={styles.locationInput}
                onPress={() => setShowLocationPicker(true)}
              >
                <Ionicons name="location-outline" size={20} color={COLORS.primary} />
                <Text style={styles.locationText}>
                  {location || 'Thêm vị trí'}
                </Text>
                {location && (
                  <TouchableOpacity
                    style={styles.clearLocationButton}
                    onPress={() => setLocation('')}
                  >
                    <Ionicons name="close-circle" size={20} color={COLORS.grey} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>

              <View style={styles.imagesPreview}>
                {images.map((image, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri: image }} style={styles.image} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => setImages(images.filter((_, i) => i !== index))}
                    >
                      <Ionicons name="close-circle" size={24} color={COLORS.light} />
                    </TouchableOpacity>
                  </View>
                ))}
                {images.length < 4 && (
                  <TouchableOpacity
                    style={styles.addImageButton}
                    onPress={handlePickImage}
                  >
                    <Ionicons name="add-circle-outline" size={32} color={COLORS.primary} />
                    <Text style={styles.addImageText}>Thêm ảnh</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.actions}>
                <TouchableOpacity style={styles.action} onPress={handlePickImage}>
                  <Ionicons name="image-outline" size={24} color={COLORS.primary} />
                  <Text style={styles.actionText}>Thêm ảnh</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.action}
                  onPress={() => setShowLocationPicker(true)}
                >
                  <Ionicons name="location-outline" size={24} color={COLORS.primary} />
                  <Text style={styles.actionText}>Check in</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <LocationPicker
        visible={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onSelect={setLocation}
        currentLocation={location}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.light,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    height: '85%',
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.dark,
  },
  saveButton: {
    backgroundColor: COLORS.blueLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonTextDisabled: {
    color: COLORS.grey,
  },
  body: {
    flex: 1,
  },
  contentInput: {
    borderWidth: 0,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    color: COLORS.dark,
    backgroundColor: COLORS.lightGrey,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.lightGrey,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  locationText: {
    marginLeft: 8,
    color: COLORS.dark,
    fontSize: 15,
    flex: 1,
  },
  clearLocationButton: {
    padding: 4,
  },
  imagesPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 20,
    paddingHorizontal: 4,
  },
  imageContainer: {
    position: 'relative',
    width: 110,
    height: 110,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.lightGrey,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 2,
  },
  addImageButton: {
    width: 110,
    height: 110,
    borderRadius: 12,
    backgroundColor: COLORS.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  addImageText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGrey,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.lightGrey,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  actionText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '500',
  },
}); 