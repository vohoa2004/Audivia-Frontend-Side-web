import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "@/styles/message_inbox";

interface HeaderProps {
  onBack: () => void;
  onSearch: () => void;
}

export const Header = ({ onBack, onSearch }: HeaderProps) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerInfo}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tin nhắn</Text>
      </View>
      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.headerButton} onPress={onSearch}>
          <Ionicons name="search" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}; 