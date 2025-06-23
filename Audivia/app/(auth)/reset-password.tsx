import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { useState } from 'react';
import { resetPassword } from '@/services/user';
import { LinearGradient } from 'expo-linear-gradient';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  const { email, code } = useLocalSearchParams();

  const handleSubmit = async () => {
    try {
      if (!newPassword || !confirmPassword) {
        alert('Vui lòng nhập đầy đủ thông tin');
        return;
      }

      if (newPassword !== confirmPassword) {
        alert('Mật khẩu xác nhận không khớp');
        return;
      }

      // if (newPassword.length < 6) {
      //   alert('Mật khẩu phải có ít nhất 6 ký tự');
      //   return;
      // }
      
      const response =  await resetPassword(email as string, newPassword);
      if (!response.isSuccess) {
        alert(response.Message);
        return;
      }
      alert('Đặt lại mật khẩu thành công');
      router.replace('/login');
    } catch (error: any) {
      console.error('Error:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Có lỗi xảy ra, vui lòng thử lại');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Đặt Lại Mật Khẩu</Text>
        <Text style={styles.subtitle}>
          Vui lòng nhập mật khẩu mới của bạn
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu mới"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Xác nhận mật khẩu mới"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

      <TouchableOpacity onPress={handleSubmit}  activeOpacity={0.7}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.purpleGradient]}  // Thay bằng màu gradient bạn muốn
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}  // Style cho nút
        >
          <Text style={[styles.buttonText, { backgroundColor: 'transparent' }]}>
          Đặt Lại Mật Khẩu
          </Text>
        </LinearGradient>
      </TouchableOpacity>


        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Quay Lại</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  form: {
    gap: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    padding: 15,
    alignItems: 'center',
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: 16,
  },
}); 