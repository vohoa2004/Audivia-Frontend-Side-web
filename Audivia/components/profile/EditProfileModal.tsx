import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, Platform, FlatList, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '@/constants/theme';
import { User } from '@/models';
import { getCountryList } from '@/services/user';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: Partial<User>) => void;
  user: User;
}

const jobs = [
  "Học sinh/Sinh viên",
  "Kinh doanh/Quản lý",
  "Văn phòng/Hành chính",
  "Công nghệ thông tin (IT)",
  "Marketing/Truyền thông",
  "Tài chính/Kế toán",
  "Giáo dục/Đào tạo",
  "Y tế/Dược phẩm",
  "Xây dựng/Kỹ thuật",
  "Du lịch/Khách sạn",
  "Nghệ thuật/Sáng tạo",
  "Lao động phổ thông",
  "Nghỉ hưu",
  "Nội trợ",
  "Khác"
];
export const EditProfileModal = ({ visible, onClose, onSave, user }: EditProfileModalProps) => {
  const [birthDay, setbirthDay] = useState<Date | undefined>(user.birthDay ? new Date(user.birthDay) : undefined);
  const [gender, setGender] = useState<boolean | undefined>(user.gender);
  const [job, setJob] = useState<string | undefined>(user.job);
  const [country, setCountry] = useState<string | undefined>(user.country);
  const [fullName, setFullName] = useState<string | undefined>(user.fullName);
  const [phone, setPhone] = useState<string | undefined>(user.phone);
  const [bio, setBio] = useState<string | undefined>(user.bio);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showJobPickerModal, setShowJobPickerModal] = useState(false);
  const [showCountryPickerModal, setShowCountryPickerModal] = useState(false);
  const [countries, setCountries] = useState<string[]>([]);

  const dateInputRef = useRef<HTMLInputElement>(null); // Ref for web input

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const fetchedCountries = await getCountryList();
        setCountries(fetchedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
        Alert.alert("Lỗi", "Không thể tải danh sách quốc gia.");
      }
    };
    fetchCountries();
  }, []);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'web') {
      const dateString = event.target.value;
      const date = new Date(dateString);
      if (isNaN(date.getTime()) && dateString !== '') {
        Alert.alert('Lỗi định dạng', 'Ngày sinh không hợp lệ. Vui lòng nhập định dạng YYYY-MM-DD.');
        setbirthDay(undefined);
      } else {
        setbirthDay(dateString ? date : undefined);
      }
    } else { // Native platforms
      setShowDatePicker(false);
      if (event.type === 'set') {
        const currentDate = selectedDate || birthDay;
        setbirthDay(currentDate);
      }
    }
  };

  const handleSave = () => {
    // Format birthDay to YYYY-MM-DD for DateOnly backend
    const formattedBirthDay = birthDay ? birthDay.toISOString().split('T')[0] : undefined;

    onSave({
      birthDay: formattedBirthDay,
      gender,
      job,
      country,
      fullName,
      phone,
      bio,
    });
    onClose();
  };

  const renderOptionItem = (item: string, setValue: (value: string) => void, closeModal: () => void) => (
    <TouchableOpacity
      style={styles.pickerItem}
      onPress={() => {
        setValue(item);
        closeModal();
      }}
    >
      <Text style={styles.pickerItemText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Chỉnh sửa thông tin cá nhân</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.dark} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollViewContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ngày sinh:</Text>
              {Platform.OS === 'web' ? (
                <input
                  ref={dateInputRef}
                  type="date"
                  value={birthDay ? birthDay.toISOString().split('T')[0] : ''}
                  onChange={handleDateChange}
                />
              ) : (
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
                  <Text style={styles.datePickerButtonText}>
                    {birthDay ? birthDay.toLocaleDateString() : "Chọn ngày sinh"}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color={COLORS.grey} />
                </TouchableOpacity>
              )}
              {showDatePicker && Platform.OS !== 'web' && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={birthDay || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Giới tính:</Text>
              <View style={styles.genderContainer}>
                <TouchableOpacity
                  style={[styles.genderButton, gender === false && styles.genderButtonActive]}
                  onPress={() => setGender(false)}
                >
                  <Text style={[styles.genderButtonText, gender === false && styles.genderButtonTextActive]}>Nam</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.genderButton, gender === true && styles.genderButtonActive]}
                  onPress={() => setGender(true)}
                >
                  <Text style={[styles.genderButtonText, gender === true && styles.genderButtonTextActive]}>Nữ</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Họ và tên:</Text>
              <TextInput
                style={styles.textInput}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Nhập họ và tên"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Số điện thoại:</Text>
              <TextInput
                style={styles.textInput}
                value={phone}
                onChangeText={setPhone}
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bio:</Text>
              <TextInput
                style={styles.textInput}
                value={bio}
                onChangeText={setBio}
                placeholder="Nhập bio của bạn"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nghề nghiệp:</Text>
              <TouchableOpacity onPress={() => setShowJobPickerModal(true)} style={styles.dropdownButton}>
                <Text style={styles.dropdownButtonText}>{job || "Chọn nghề nghiệp"}</Text>
                <Ionicons name="chevron-down-outline" size={20} color={COLORS.grey} />
              </TouchableOpacity>

              <Modal
                visible={showJobPickerModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowJobPickerModal(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={[styles.modalContent, { maxHeight: '50%' }]}>
                    <FlatList
                      data={jobs}
                      keyExtractor={(item) => item}
                      renderItem={({ item }) => renderOptionItem(item, setJob, () => setShowJobPickerModal(false))}
                    />
                  </View>
                </View>
              </Modal>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Quốc gia:</Text>
              <TouchableOpacity onPress={() => setShowCountryPickerModal(true)} style={styles.dropdownButton}>
                <Text style={styles.dropdownButtonText}>{country || "Chọn quốc gia"}</Text>
                <Ionicons name="chevron-down-outline" size={20} color={COLORS.grey} />
              </TouchableOpacity>

              <Modal
                visible={showCountryPickerModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowCountryPickerModal(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={[styles.modalContent, { maxHeight: '50%' }]}>
                    <FlatList
                      data={countries}
                      keyExtractor={(item) => item}
                      renderItem={({ item }) => renderOptionItem(item, setCountry, () => setShowCountryPickerModal(false))}
                    />
                  </View>
                </View>
              </Modal>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Lưu</Text>
            </TouchableOpacity>
          </ScrollView>
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
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: COLORS.darkGrey,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: 8,
    padding: 10,
  },
  datePickerButtonText: {
    fontSize: 16,
    color: COLORS.dark,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.grey,
    marginHorizontal: 5,
  },
  genderButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  genderButtonText: {
    fontSize: 16,
    color: COLORS.dark,
  },
  genderButtonTextActive: {
    color: COLORS.light,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: 8,
    padding: 10,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: COLORS.dark,
  },
  pickerItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey,
  },
  pickerItemText: {
    fontSize: 16,
    color: COLORS.dark,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: COLORS.light,
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollViewContent: {
    flex: 1,
  },
  datePickerTouchable: {
    width: '100%',
  },
}); 