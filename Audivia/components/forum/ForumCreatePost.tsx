import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { PostModal } from "../common/PostModal";
import { Post } from "@/models";
import { createPost } from "@/services/post";

interface ForumCreatePostProps {
  onPostCreated?: (newPost: Post) => void;
}

export const ForumCreatePost = ({ onPostCreated }: ForumCreatePostProps) => {
    const [showPostModal, setShowPostModal] = useState(false)
    const { user } = useUser()
    const DEFAULT_AVATAR = "https://res.cloudinary.com/dgzn2ix8w/image/upload/v1745396073/Audivia/ddizjlgkux0eoifrsoco.avif"
    const [posts, setPosts] = useState<Post[]>([])

    const handleSavePost = async (postData: { content: string; location: string; images: string[] }) => {
        if (!user?.id) {
            Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng');
            return;
        }

        const response = await createPost(
            postData.images,
            postData.location,
            postData.content,
            user.id
        );
        if (response.success) {
            setPosts([response.response, ...posts]);
            onPostCreated?.(response.response);
            setShowPostModal(false);
        } else {
            throw new Error(response.message || 'Không thể tạo bài viết');
        }
    }
    return (
        <View style={styles.createContain}>
            <View style={styles.createPostCard}>
                <View style={styles.createPostHeader}>
                    <Image source={{ uri: user?.avatarUrl || DEFAULT_AVATAR }} style={styles.createPostAvatar} />
                    <TouchableOpacity style={styles.createPostInput} onPress={() => setShowPostModal(true)}>
                        <Text style={styles.createPostPlaceholder}>Bạn đang nghĩ gì?</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.createPostActions}>
                    <TouchableOpacity style={styles.createPostAction} onPress={() => setShowPostModal(true)}>
                        <Ionicons name="image-outline" size={20} color={COLORS.green} />
                        <Text style={styles.createPostActionText}>Ảnh</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.createPostAction} onPress={() => setShowPostModal(true)}>
                        <Ionicons name="location-outline" size={20} color={COLORS.blue} />
                        <Text style={styles.createPostActionText}>Check in</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <PostModal
                visible={showPostModal}
                onClose={() => setShowPostModal(false)}
                onSave={handleSavePost}
            />
        </View>
    );
};
const styles = StyleSheet.create({
    createContain: {
        paddingHorizontal:16
    },
    createPostCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 12,
        marginTop: 20,
        marginBottom: 16,
        paddingHorizontal: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 5
    },
    createPostHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    createPostAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    createPostInput: {
        flex: 1,
        backgroundColor: "#F0F2F5",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    createPostPlaceholder: {
        color: "#666",
    },
    createPostActions: {
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: "#EEE",
        paddingTop: 12,
    },
    createPostAction: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    createPostActionText: {
        marginLeft: 4,
        fontSize: 14,
        color: "#666",
    },
})