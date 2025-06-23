import { Image, Text, View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "@/styles/auth.styles";
import { COLORS } from "@/constants/theme";
import MaskedView from "@react-native-masked-view/masked-view";
import { useRouter } from "expo-router";
import { register } from "@/services/user";
import AuthForm from "@/components/common/AuthForm";
export default function Signup() {
  const router = useRouter();

  const handleSignup = async (email: string, password: string, username?: string) => {
    if (!username) {
      alert("Vui lòng nhập tên người dùng");
      return;
    }
    try {
      const response = await register(username, email, password);
      if (response.success) {
        alert(response.message);
        router.push("/signup_success");
      }
    } catch (error: any) {
      if (error.response) {
        alert(error.response.data.message);
      }
    }
  };

  const handleGoogleSignup = async () => {
    console.log("Google Signup")
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff' }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Circular Background Shape */}
        <View style={styles.circleBottomShape} />
        {/* Logo */}
        <View style={styles.logoSection}>
          <MaskedView maskElement={
            <Text style={[styles.brandTitle, { backgroundColor: 'transparent' }]}>
              Đăng Ký
            </Text>
          }>
            <LinearGradient
              colors={[COLORS.primary, COLORS.purpleGradient]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}>
              <Text style={[styles.brandTitle, { opacity: 0 }]}>
                Đăng Ký
              </Text>
            </LinearGradient>
          </MaskedView>
          <Image source={{ uri: 'https://res.cloudinary.com/dgzn2ix8w/image/upload/v1748439988/Audivia/xxynw0hglztf4mijnobw.png' }} style={styles.logo} />

        </View>

        <AuthForm
          type="signup"
          onSubmit={handleSignup}
          onGoogleAuth={handleGoogleSignup}
          onToggleAuth={() => router.push("/login")}
        />

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
