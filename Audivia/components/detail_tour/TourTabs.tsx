import { View, TouchableOpacity, Text } from "react-native"
import { styles } from "@/styles/tour_detail.styles"

interface TourTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export const TourTabs = ({ activeTab, onTabChange }: TourTabsProps) => {
  return (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "about" && styles.activeTab]}
        onPress={() => onTabChange("about")}
      >
        <Text style={[styles.tabText, activeTab === "about" && styles.activeTabText]}>Giới thiệu</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === "before" && styles.activeTab]}
        onPress={() => onTabChange("before")}
      >
        <Text style={[styles.tabText, activeTab === "before" && styles.activeTabText]}>Trước khi đi</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === "reviews" && styles.activeTab]}
        onPress={() => onTabChange("reviews")}
      >
        <Text style={[styles.tabText, activeTab === "reviews" && styles.activeTabText]}>Đánh giá</Text>
      </TouchableOpacity>
    </View>
  )
} 