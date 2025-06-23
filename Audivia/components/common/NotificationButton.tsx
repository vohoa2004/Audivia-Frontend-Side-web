import { TouchableOpacity, View, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { router } from "expo-router";
import { useNotificationCount } from "@/hooks/useNotificationCount";
import { useEffect, useState, useCallback } from "react";

export const NotificationButton = () => {
    const { unreadCount, loadUnreadCount } = useNotificationCount();
    const [count, setCount] = useState(0);

    // Force reload count when component mounts
    useEffect(() => {
        loadUnreadCount();
    }, []);

    // Update local state when unreadCount changes
    useEffect(() => {
        console.log('NotificationButton received unreadCount:', unreadCount);
        setCount(unreadCount);
    }, [unreadCount]);

    const handlePress = useCallback(() => {
        console.log('Notification button pressed');
        loadUnreadCount(); // Reload count before navigating
        router.push("/(screens)/notifications");
    }, [loadUnreadCount]);

    return (
        <TouchableOpacity
            onPress={handlePress}
        >
            <View style={{ position: 'relative' }}>
                <Image 
                    source={{ uri: 'https://res.cloudinary.com/dgzn2ix8w/image/upload/v1748529207/Audivia/vsx5niettalvvfpx1j3t.png' }}
                    style={{
                        width: 36,
                        height: 36,
                        resizeMode: 'contain'
                    }}
                />
                {count > 0 && (
                    <View style={{
                        position: 'absolute',
                        top: -4,
                        right: -8,
                        backgroundColor: COLORS.red,
                        borderRadius: 10,
                        minWidth: 18,
                        height: 18,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: 4,
                    }}>
                        <Text style={{
                            color: 'white',
                            fontSize: 11,
                            fontWeight: 'bold',
                        }}>
                            {count > 99 ? '99+' : count}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}; 