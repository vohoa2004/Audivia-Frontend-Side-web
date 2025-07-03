import { Image, Text, TouchableOpacity, View, TextInput, Modal, FlatList, ActivityIndicator, Alert, StyleSheet, ScrollView } from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/forum.styles";
import { useUser } from "@/hooks/useUser";
import { router } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import { reactPost, commentPost, getPostComments, getReactionByUserAndPost, updateComment, deleteComment } from "@/services/post";
import { Post as PostModel, Comment as CommentModel } from "@/models";

interface ForumPostProps {
  item: PostModel;
}

export const ForumPost = ({ item }: ForumPostProps) => {
  const { user } = useUser();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(item.likes);
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const [allComments, setAllComments] = useState<CommentModel[]>([]);
  const [commentsCount, setCommentsCount] = useState(item.comments);

  const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [editingComment, setEditingComment] = useState<CommentModel | null>(null);
  const [editedContent, setEditedContent] = useState("");

  // Effect to update counts if the item prop changes (e.g., due to parent re-fetch)
  useEffect(() => {
    // Ensure counts are clamped to 0 when re-synchronizing from prop
    setLikesCount(Math.max(0, item.likes));
    setCommentsCount(Math.max(0, item.comments));
  }, [item.likes, item.comments]);

  useEffect(() => {
    const fetchUserReactions = async () => {
      if (!user?.id || !item.id) return;
      try {
        const res = await getReactionByUserAndPost(user.id, item.id);
        if (res.success && res.response) {
          const hasReacted = res.response !== null;
          setIsLiked(hasReacted);
        }
      } catch (error) {
      }
    };
    fetchUserReactions();
  }, [user?.id, item.id]);

  const navigateToProfile = useCallback((userId: string) => {
    router.push({
      pathname: "/profile",
      params: { userId },
    });
  }, [router]);

  const handleLike = useCallback(async () => {
    if (!user?.id) return;
    const originallyLiked = isLiked;
    setIsLiked(!originallyLiked);
    // Ensure likesCount never goes below 0
    setLikesCount(prev => Math.max(0, originallyLiked ? prev - 1 : prev + 1));
    try {
      await reactPost(0, item.id, user.id);
    } catch (error) {
      console.error('Error reacting to post:', error);
      setIsLiked(originallyLiked);
      // Revert, ensuring likesCount never goes below 0
      setLikesCount(prev => Math.max(0, originallyLiked ? prev + 1 : prev - 1));
    }
  }, [user?.id, item.id, isLiked]);

  const handleComment = useCallback(async () => {
    if (!user?.id || !commentText.trim() || isSubmittingComment) return;
    setIsSubmittingComment(true);
    try {
      const newCommentResponse = await commentPost(commentText.trim(), item.id, user.id);
      if (newCommentResponse.success && newCommentResponse.response) {
        const newComment = newCommentResponse.response;
        setAllComments(prevComments => [newComment, ...prevComments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setCommentText("");
        // Ensure commentsCount never goes below 0
        setCommentsCount(prev => Math.max(0, prev + 1));
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  }, [user?.id, item.id, commentText, isSubmittingComment]);

  const handleOpenCommentsModal = useCallback(async () => {
    if (isLoadingComments) return;
    setIsLoadingComments(true);
    try {
      const postCommentsResponse = await getPostComments(item.id);
      if (postCommentsResponse.success && postCommentsResponse.response) {
        setAllComments(postCommentsResponse.response.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setIsCommentsModalVisible(true);
      } else {
        setAllComments([]);
        console.error("API call to getPostComments was not successful or returned no comments.");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      setAllComments([]);
    } finally {
      setIsLoadingComments(false);
    }
  }, [item.id, isLoadingComments]);

  const handleUpdateComment = useCallback(async () => {
    if (!editingComment || !editedContent.trim() || !user?.id) return;
    try {
      const originalComments = [...allComments];
      const updatedComments = allComments.map(c =>
        c.id === editingComment.id ? { ...c, content: editedContent.trim() } : c
      ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setAllComments(updatedComments);
      setEditingComment(null);
      setEditedContent("");

      await updateComment(editingComment.id, editedContent.trim(), user.id);
    } catch (error) {
      console.error("Error updating comment:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi cập nhật bình luận.");
    }
  }, [editingComment, editedContent, user?.id, allComments]);

  const handleDeleteComment = useCallback((commentId: string) => {
    if (!user?.id) return;
    Alert.alert(
      "Xóa bình luận",
      "Bạn có chắc muốn xóa bình luận này không?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            const originalComments = [...allComments];
            setAllComments(prev => prev.filter(c => c.id !== commentId));
            setCommentsCount(prev => Math.max(0, prev - 1));
            try {
              await deleteComment(commentId, user.id);
            } catch (error) {
              // Revert on failure
              setAllComments(originalComments);
              setCommentsCount(prev => prev + 1);
              console.error("Error deleting comment:", error);
              Alert.alert("Lỗi", "Xóa bình luận thất bại.");
            }
          },
        },
      ]
    );
  }, [user?.id, allComments]);


  const renderCommentItem = useCallback(({ item: commentItem }: { item: CommentModel }) => {
    const isAuthor = commentItem.createdBy === user?.id;
    const handleStartEdit = () => {
      setEditingComment(commentItem);
      setEditedContent(commentItem.content);
    };

    const handleCancelEdit = () => {
      setEditingComment(null);
      setEditedContent("");
    };

    if (editingComment?.id === commentItem.id) {
      return (
        <View style={localStyles.commentEditingContainer}>
          <TextInput
            value={editedContent}
            onChangeText={setEditedContent}
            style={localStyles.commentEditTextInput}
            autoFocus
            multiline
          />
          <View style={localStyles.editingControls}>
            <TouchableOpacity onPress={handleUpdateComment} style={[localStyles.editingButton, { backgroundColor: COLORS.primary }]}>
              <Text style={localStyles.editingButtonText}>Lưu</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancelEdit} style={[localStyles.editingButton, { backgroundColor: COLORS.grey }]}>
              <Text style={localStyles.editingButtonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.modalCommentItem}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start' }}>
          <Text style={styles.modalCommentUser}>{commentItem.userName}:</Text>
          <Text style={styles.modalCommentText}>{commentItem.content}</Text>
        </View>
        {isAuthor && (
          <View style={localStyles.commentActions}>
            <TouchableOpacity onPress={handleStartEdit} style={{ marginRight: 15 }}>
              <Ionicons name="pencil" size={18} color={COLORS.dark} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteComment(commentItem.id)}>
              <Ionicons name="trash" size={18} color={COLORS.red} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }, [user?.id, editingComment, editedContent, handleUpdateComment, handleDeleteComment]);

  return (
    <View style={styles.postWrapper}>
      <View style={styles.postContainer}>
        {/* Post Header */}
        <View style={styles.postHeader}>
          <TouchableOpacity
            style={styles.userInfo}
            onPress={() => navigateToProfile(item.user.id)}
          >
            {item.user.avatarUrl ? (
              <Image
                source={{ uri: item.user.avatarUrl }}
                style={styles.avatar}
              />
            ) : (
              <Ionicons
                name="person-circle-outline"
                style={styles.avatar}
                size={44}
                color={COLORS.primary}
              />
            )}
            <View>
              <Text style={styles.userName}>{item.user.userName}</Text>
              <Text style={styles.location}>{item.location}</Text>
              {/* Time */}
              <Text style={styles.timeText}>{item.time}</Text>

            </View>

          </TouchableOpacity>

        </View>

        {/* Post Image */}
        <View style={styles.postImageContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          {item.images.map((img, idx) => (
            <Image
              key={idx}
              source={{ uri: img }}
              style={styles.postImage}
               resizeMode="cover"
            />
          ))}
        </ScrollView>
      </View>

        {/* Post Actions */}
        <View style={styles.postActions}>
          <View style={styles.leftActions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
              <AntDesign
                name={isLiked ? "heart" : "hearto"}
                size={24}
                color={isLiked ? COLORS.red : COLORS.dark}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleOpenCommentsModal}>
              <Ionicons name="chatbubble-outline" size={22} color={COLORS.dark} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Post Stats */}
        <View style={styles.postStats}>
          <Text style={styles.likes}>{likesCount} lượt thích</Text>
        </View>

        {/* Post Content */}
        <View style={styles.postContent}>
          <Text style={styles.postText}>{item.content}</Text>
        </View>

        {/* Comments Link - triggers modal */}
        {commentsCount > 0 && (
          <TouchableOpacity style={styles.commentsLink} onPress={handleOpenCommentsModal}>
            <Text style={styles.commentsText}>
              {isLoadingComments ? 'Đang tải bình luận...' : `Xem tất cả ${commentsCount} bình luận`}
            </Text>
          </TouchableOpacity>
        )}


        {/* Comment Input */}
        <View style={styles.commentInputContainer}>
          {user?.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} style={styles.commentAvatar} />
          ) : (
            <Ionicons name="person-circle-outline" style={styles.commentAvatar} size={30} color={COLORS.grey} />
          )}
          <TextInput
            style={styles.commentInput}
            placeholder="Thêm bình luận..."
            placeholderTextColor={COLORS.grey}
            value={commentText}
            onChangeText={setCommentText}
            editable={!isSubmittingComment}
          />
          <TouchableOpacity onPress={handleComment} disabled={isSubmittingComment}>
            <Text style={[styles.postButton, isSubmittingComment && { opacity: 0.5 }]}>
              {isSubmittingComment ? "Đang đăng..." : "Đăng"}
            </Text>
          </TouchableOpacity>
        </View>
        {/* Comments Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isCommentsModalVisible}
          onRequestClose={() => {
            setIsCommentsModalVisible(!isCommentsModalVisible);
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Bình luận</Text>
              {isLoadingComments && !allComments.length ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 20 }} />
              ) : (
                <FlatList
                  data={allComments}
                  renderItem={renderCommentItem}
                  keyExtractor={(c) => c.id}
                  ListEmptyComponent={<Text style={{ paddingVertical: 10 }}>Chưa có bình luận nào.</Text>}
                  style={{ width: '100%' }}
                />
              )}
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setIsCommentsModalVisible(!isCommentsModalVisible)}
              >
                <Text style={styles.textStyle}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>

  );
};

const localStyles = StyleSheet.create({
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  commentEditingContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginVertical: 4,
  },
  commentEditTextInput: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    minHeight: 50,
  },
  editingControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editingButton: {
    marginLeft: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  editingButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
