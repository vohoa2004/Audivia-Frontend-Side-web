import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NotificationButton } from "@/components/common/NotificationButton";
import { ChatMessageButton } from "../common/ChatMessage";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { useState } from "react";
import { SearchButton } from '../common/SearchButton';

interface HeaderProps{
    title?: string
}
export const Header = ({title}: HeaderProps) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.purpleGradient]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.header, { height: 80 }]}
    >
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        {!showSearch ? (
          <>
            <Text style={[styles.headerTitle, { color: COLORS.light }]}>{title}</Text>
            <View style={styles.headerIcons}>
              <View style={styles.searchwrapper}>
              <TouchableOpacity 
                onPress={() => setShowSearch(true)}
              >
                <Ionicons name="search" size={24} color={COLORS.light} />
              </TouchableOpacity>
              </View>
              <View style={styles.notificationWrapper}>
                <NotificationButton />
              </View>
              <ChatMessageButton />
            </View>
          </>
        ) : (
          <SearchButton
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onBack={() => setShowSearch(false)}
          />
        )}
      </View>
    </LinearGradient>
  );
}; 
const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.1)",
      },
      headerTitle: {
        fontSize: 22,
        fontWeight: "700",
      },
      headerIcons: {
        flexDirection: "row",
        alignItems: "center",
      },
      notificationWrapper: {
        marginLeft: 12
      },
      iconButton: {
        marginLeft: 20,
      },
      searchwrapper: {
        borderRadius: 20,
        padding: 10,
        backgroundColor: "rgba(255, 255, 255, 0.1)"
      },
}
)