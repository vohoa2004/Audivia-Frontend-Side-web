import { COLORS } from "@/constants/theme"
import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10
  },
  notification: {
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: COLORS.blueLight,
    borderColor: COLORS.dark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 5,
    padding: 5,
    opacity: 0.9
  },
  chat: {
    borderRadius: 20,
    backgroundColor: COLORS.blueLight,
    borderColor: COLORS.dark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 5,
    padding: 5,
    opacity: 0.9
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatarImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.grey,
    marginTop: 4,
  },
  viewModeContainer: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 4,
  },
  viewModeButton: {
    padding: 8,
    borderRadius: 4,
  },
  activeViewMode: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderColor: COLORS.purpleGradient,
    borderWidth: 0.5,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.grey,
  },
  backIcon:{
    borderRadius: 20,
    padding: 8,
    backgroundColor: "rgba(131, 81, 138, 0.1)",
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.grey,
    backgroundColor: COLORS.light,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryButtonText: {
    color: COLORS.darkGrey,
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: COLORS.white,
  },
})
