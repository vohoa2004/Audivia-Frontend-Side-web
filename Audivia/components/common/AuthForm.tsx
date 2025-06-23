import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Checkbox } from "react-native-paper";
import { COLORS } from "@/constants/theme";
import styles from "@/styles/auth.styles";

interface AuthFormProps {
  type: "login" | "signup";
  onSubmit: (email: string, password: string, username: string) => void;
  onGoogleAuth?: () => void;
  onForgotPassword?: () => void;
  onToggleAuth?: () => void;
}

export default function AuthForm({
  type,
  onSubmit,
  onGoogleAuth,
  onForgotPassword,
  onToggleAuth,
}: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [usernameFocused, setUsernameFocused] = useState(false);

  const handleSubmit = () => {
    if (type === "signup") {
      if (!username) {
        alert("Vui lòng nhập tên người dùng");
        return;
      }
      onSubmit(email, password, username);
    } else {
      onSubmit(email, password, username);
    }
  };

  return (
    <View style={styles.form}>

      {type === "signup" && (
        <View style={[styles.inputGroup, usernameFocused && { borderColor: COLORS.primary }]}>
          <Ionicons name="person-outline" size={20} color={COLORS.grey} style={styles.inputIcon} />
          <TextInput
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            placeholder="Tên người dùng"
            placeholderTextColor={COLORS.grey}
            onFocus={() => setUsernameFocused(true)}
            onBlur={() => setUsernameFocused(false)}
          />
        </View>
      )}

      <View style={[styles.inputGroup, emailFocused && { borderColor: COLORS.primary }]}>
        <Ionicons name="mail-outline" size={20} color={COLORS.grey} style={styles.inputIcon} />
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={COLORS.grey}
          keyboardType="email-address"
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
        />
      </View>

      <View style={[styles.inputGroup, passwordFocused && { borderColor: COLORS.primary }]}>
        <Ionicons name="lock-closed-outline" size={20} color={COLORS.grey} style={styles.inputIcon} />
        <TextInput
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholder="Mật khẩu"
          secureTextEntry={!showPassword}
          placeholderTextColor={COLORS.grey}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color={COLORS.grey}
          />
        </TouchableOpacity>
      </View>

      {type === "login" && (
        <View style={styles.row}>
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={checked ? 'checked' : 'unchecked'}
              onPress={() => {
                setChecked(!checked);
              }}
            />
            <Text style={styles.remember}>Nhớ đăng nhập</Text>
          </View>
          <TouchableOpacity onPress={onForgotPassword}>
            <Text style={styles.forgot}>Quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.purpleGradient]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFillObject}
        />
        <Text style={styles.loginButtonText}>
          {type === "login" ? "Đăng nhập" : "Đăng ký"}
        </Text>
      </TouchableOpacity>
      {type == "login" && (
        <View style={styles.orContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>Hoặc</Text>
          <View style={styles.line} />
        </View>
      )}

      {type === "login" && (
        <View style={styles.social}>
          <TouchableOpacity style={styles.socialButton} onPress={onGoogleAuth}>
            <Ionicons name="logo-google" size={20} color={COLORS.red} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={onGoogleAuth}>
            <Ionicons name="logo-facebook" size={20} color={COLORS.blue} style={styles.socialIcon} />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.signupWrapper}>
        <Text>
          {type === "login" ? "Bạn chưa có tài khoản? " : "Bạn đã có tài khoản? "}
        </Text>
        <TouchableOpacity onPress={onToggleAuth}>
          <Text style={styles.signupText}>
            {type === "login" ? "Đăng ký" : "Đăng nhập"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 