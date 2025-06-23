import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { useState } from 'react';
import { forgotPassword } from '@/services/user';
import { LinearGradient } from 'expo-linear-gradient';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      if (!email) {
        alert('Vui lòng nhập email của bạn');
        return;
      }
      
      await forgotPassword(email);
      alert('Mã xác thực đã được gửi đến email của bạn');
      router.push({
        pathname: '/verify-code',
        params: { email }
      });
    } catch (error: any) {
      console.log(error);
      alert(error.response.data.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quên Mật Khẩu</Text>
        <Text style={styles.subtitle}>
          Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

      <TouchableOpacity 
        onPress={handleSubmit}  // Thay bằng hàm xử lý đăng nhập của bạn
        activeOpacity={0.7}    // Độ mờ khi nhấn (tùy chọn)
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.purpleGradient]}  // Thay bằng màu gradient bạn muốn
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}  // Style cho nút
        >
         <Text style={[styles.buttonText, { backgroundColor: 'transparent' }]}>
          Gửi yêu cầu
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    


        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Quay Lại Đăng Nhập</Text>
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
    backgroundColor: '#fff', // nền có thể là trắng để tương phản với gradient chữ
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white
  },
  brandTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 10,
    color: COLORS.dark,
},
  // button: {
  //   backgroundColor: COLORS.primary,
  //   padding: 15,
  //   borderRadius: 8,
  //   alignItems: 'center',
  // },
  // buttonText: {
  //   color: '#fff',
  //   fontSize: 16,
  //   fontWeight: '600',
  // },
  backButton: {
    padding: 15,
    alignItems: 'center',
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: 16,
  },
}); 