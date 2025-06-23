import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { useState } from 'react';
import { verifyResetCode } from '@/services/user';
import { LinearGradient } from 'expo-linear-gradient';

export default function VerifyCode() {
  const [code, setCode] = useState('');
  const router = useRouter();
  const { email } = useLocalSearchParams();

  const handleSubmit = async () => {
    try {
      if (!code) {
        alert('Vui lòng nhập mã xác thực');
        return;
      }
     
      const response = await verifyResetCode(email as string, code);
      
      if (!response.isSuccess) {
        alert("Mã xác thực không hợp lệ hoặc đã hết hạn!");
        return;
      }

      router.push({
        pathname: '/(auth)/reset-password',
        params: { email}
      });
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
        <Text style={styles.title}>Xác Thực Mã Code</Text>
        <Text style={styles.subtitle}>
          Vui lòng nhập mã xác thực đã được gửi đến email {email}
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nhập mã xác thực"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
        />

      <TouchableOpacity onPress={handleSubmit}  activeOpacity={0.7}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.purpleGradient]}  // Thay bằng màu gradient bạn muốn
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}  // Style cho nút
        >
         <Text style={[styles.buttonText, { backgroundColor: 'transparent' }]}>
          Xác nhận
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
    textAlign: 'center',
    letterSpacing: 8,
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