import { router } from "expo-router"
import { Image, TouchableOpacity, View } from "react-native"

export const ChatMessageButton = () => {
    return (
        <View style={{ position: 'relative' }}>
            <TouchableOpacity onPress={() => router.push('/(screens)/message_inbox')}>
                <Image source={{ uri: 'https://res.cloudinary.com/dgzn2ix8w/image/upload/v1748529717/Audivia/usnhq7gkkmpmy8c9ax2s.png' }}
                    style={{
                        width: 36,
                        height: 36,
                        resizeMode: 'contain',
                    }} />
            </TouchableOpacity>
        </View>
    )
}