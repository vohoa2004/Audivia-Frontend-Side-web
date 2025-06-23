import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';

interface LocationPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (location: string) => void;
  currentLocation?: string;
}

const VIETNAM_PROVINCES = [
  'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng',
  'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu',
  'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước',
  'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Đắk Lắk', 'Đắk Nông',
  'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Giang',
  'Hà Nam', 'Hà Tĩnh', 'Hải Dương', 'Hậu Giang', 'Hòa Bình',
  'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu',
  'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định',
  'Nghệ An', 'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên',
  'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị',
  'Sóc Trăng', 'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên',
  'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang', 'Trà Vinh', 'Tuyên Quang',
  'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái',
];

export const LocationPicker: React.FC<LocationPickerProps> = ({
  visible,
  onClose,
  onSelect,
  currentLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customLocation, setCustomLocation] = useState(currentLocation || '');

  const filteredProvinces = VIETNAM_PROVINCES.filter(province =>
    province.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (location: string) => {
    onSelect(location);
    onClose();
  };

  const handleCustomLocation = () => {
    if (customLocation.trim()) {
      onSelect(customLocation.trim());
      onClose();
    }
  };

  return (
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
            <Text style={styles.title}>Chọn vị trí</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={COLORS.grey} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm tỉnh thành"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={COLORS.grey}
            />
          </View>

          <View style={styles.customLocationContainer}>
            <TextInput
              style={styles.customLocationInput}
              placeholder="Hoặc nhập vị trí khác"
              value={customLocation}
              onChangeText={setCustomLocation}
              placeholderTextColor={COLORS.grey}
            />
            <TouchableOpacity
              style={[
                styles.customLocationButton,
                !customLocation.trim() && styles.customLocationButtonDisabled,
              ]}
              onPress={handleCustomLocation}
              disabled={!customLocation.trim()}
            >
              <Text style={styles.customLocationButtonText}>Thêm</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredProvinces}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.locationItem}
                onPress={() => handleSelect(item)}
              >
                <Ionicons name="location-outline" size={20} color={COLORS.primary} />
                <Text style={styles.locationText}>{item}</Text>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
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
    height: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.dark,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGrey,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.dark,
  },
  customLocationContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  customLocationInput: {
    flex: 1,
    backgroundColor: COLORS.lightGrey,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.dark,
  },
  customLocationButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  customLocationButtonDisabled: {
    backgroundColor: COLORS.grey,
  },
  customLocationButtonText: {
    color: COLORS.light,
    fontSize: 16,
    fontWeight: '600',
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
  },
  locationText: {
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.dark,
  },
}); 