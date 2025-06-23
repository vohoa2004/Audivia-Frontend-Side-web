import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "@/styles/forum.styles";

interface ForumTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const ForumTabs = ({ activeTab, setActiveTab }: ForumTabsProps) => {
  return (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "Popular" && styles.activeTab]}
        onPress={() => setActiveTab("Popular")}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "Popular" && styles.activeTabText,
          ]}
        >
          Đề xuất
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === "YourPost" && styles.activeTab]}
        onPress={() => setActiveTab("YourPost")}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "YourPost" && styles.activeTabText,
          ]}
        >
          Bài đăng của bạn
        </Text>
      </TouchableOpacity>
    </View>
  );
}; 