import { View, Text, TouchableOpacity } from "react-native"
import styles from "@/styles/profile.styles"

interface ProfileTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export const ProfileTabs = ({ activeTab, onTabChange }: ProfileTabsProps) => {
  return (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "posts" && styles.activeTab]}
        onPress={() => onTabChange("posts")}
      >
        <Text style={[styles.tabText, activeTab === "posts" && styles.activeTabText]}>Bài viết</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === "about" && styles.activeTab]}
        onPress={() => onTabChange("about")}
      >
        <Text style={[styles.tabText, activeTab === "about" && styles.activeTabText]}>Giới thiệu</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === "friends" && styles.activeTab]}
        onPress={() => onTabChange("friends")}
      >
        <Text style={[styles.tabText, activeTab === "friends" && styles.activeTabText]}>Bạn bè</Text>
      </TouchableOpacity>
    </View>
  )
} 