import { COLORS } from "@/constants/theme"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { Image, StyleSheet, TouchableOpacity, View } from "react-native"

export const BackButton = () => {
    const goBack = () => {
        router.back()
    }
    return (
        <View style={{ position: 'relative', }}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    backButton:{
        paddingLeft:4
    }
}
)