import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";

interface SearchProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onBack: () => void;
}

export const SearchButton = ({ searchQuery, onSearchChange, onBack }: SearchProps) => {
  return (
    <View style={styles.searchHeader}>
      <TouchableOpacity style={styles.searchBackButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <View style={styles.searchInputContainer}>
        <Ionicons name="search" size={20} color={COLORS.primary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm ..."
          value={searchQuery}
          onChangeText={onSearchChange}
          autoFocus
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange("")}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}; 
const styles = StyleSheet.create({
    searchHeader: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 5,
      },
      searchBackButton: {
        marginRight: 12,
      },
      searchInputContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 5,
      },
      searchInput: {
        flex: 1,
        fontSize: 16,
        marginLeft: 8,
        color: COLORS.grey,
      },
}
)