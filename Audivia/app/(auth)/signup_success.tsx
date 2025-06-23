import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import styles from "@/styles/auth.styles";
import { COLORS } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";

export default function SignupSuccess() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.form}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20, color: COLORS.primary }}>
        Đăng ký thành công! 
      </Text>
      <Text style={{color: COLORS.purple, fontSize: 16, marginBottom: 20}}>
        Vui lòng kiểm tra email để xác nhận tài khoản.
      </Text>
      <TouchableOpacity style={styles.loginButton} onPress={() => router.push("/login")}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.purpleGradient]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFillObject}
          />
          <Text style={styles.loginButtonText}>
            Đăng nhập
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}