import { View, Text, Image, TouchableOpacity, FlatList, TextInput, Modal, ActivityIndicator, Alert, StyleSheet } from "react-native"
import { Ionicons, AntDesign } from "@expo/vector-icons"
import { COLORS } from "@/constants/theme"
import styles from "@/styles/profile.styles"
import { Post, User, Comment as CommentModel } from "@/models"
import { useState, useEffect } from "react"
import { useUser } from "@/hooks/useUser"
import { reactPost, commentPost, getPostComments, getReactionByUserAndPost, deleteComment, updateComment } from "@/services/post"

interface ProfilePostsProps {
  posts: Post[]
  user: User
  defaultAvatar: string
  isOwnProfile: boolean
  onEditPost: (post: Post) => void
  onDeletePost: (postId: string) => void
  onCreatePost: () => void
}

export const ProfilePosts = ({
  posts,
  user: profileUser,
  defaultAvatar,
  isOwnProfile,
  onEditPost,
  onDeletePost,
  onCreatePost
}: ProfilePostsProps) => {
  const { user } = useUser();
  const [showPostOptions, setShowPostOptions] = useState<string | null>(null)

  const PostItem = ({ item }: { item: Post }) => {
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

    useEffect(() => {
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

    const handleLike = async () => {
      if (!user?.id) return;
      const originallyLiked = isLiked;
      setIsLiked(!originallyLiked);
      setLikesCount(prev => Math.max(0, originallyLiked ? prev - 1 : prev + 1));
      try {
        await reactPost(0, item.id, user.id);
      } catch (error) {
        console.error('Error reacting to post:', error);
        setIsLiked(originallyLiked);
        setLikesCount(prev => Math.max(0, originallyLiked ? prev + 1 : prev - 1));
      }
    };

    const handleComment = async () => {
      if (!user?.id || !commentText.trim() || isSubmittingComment) return;
      setIsSubmittingComment(true);
      try {
        const newCommentResponse = await commentPost(commentText.trim(), item.id, user.id);
        if (newCommentResponse.success && newCommentResponse.response) {
          const newComment = newCommentResponse.response;
          setAllComments(prevComments => [newComment, ...prevComments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
          setCommentText("");
          setCommentsCount(prev => Math.max(0, prev + 1));
        }
      } catch (error) {
        console.error('Error posting comment:', error);
      } finally {
        setIsSubmittingComment(false);
      }
    };

    const handleOpenCommentsModal = async () => {
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
    };

    const handleUpdateComment = async () => {
      if (!editingComment || !editedContent.trim() || !user?.id) return;

      const originalComments = [...allComments];
      // Optimistic update
      const updatedComments = allComments.map(c =>
        c.id === editingComment.id ? { ...c, content: editedContent.trim() } : c
      ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setAllComments(updatedComments);
      setEditingComment(null);
      setEditedContent("");

      try {
        await updateComment(editingComment.id, editedContent.trim(), user.id);
      } catch (error) {
        setAllComments(originalComments);
        console.error("Error updating comment:", error);
        Alert.alert("Lỗi", "Đã xảy ra lỗi khi cập nhật bình luận.");
      }
    };

    const handleDeleteComment = (commentId: string) => {
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
              // Optimistic deletion
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
    };

    const renderCommentItemModal = ({ item: commentItem }: { item: CommentModel }) => {
      const isAuthor = commentItem.createdBy === user?.id;

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
              <TouchableOpacity onPress={() => setEditingComment(null)} style={[localStyles.editingButton, { backgroundColor: COLORS.grey }]}>
                <Text style={localStyles.editingButtonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }

      return (
        <View style={localStyles.commentItemContainer}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 'bold' }}>{commentItem.userName}:</Text>
            <Text>{commentItem.content}</Text>
          </View>
          {isAuthor && (
            <View style={localStyles.commentActions}>
              <TouchableOpacity onPress={() => { setEditingComment(commentItem); setEditedContent(commentItem.content); }} style={{ marginRight: 15 }}>
                <Ionicons name="pencil" size={18} color={COLORS.dark} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteComment(commentItem.id)}>
                <Ionicons name="trash" size={18} color={COLORS.red} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
    };

    return (
      <View style={styles.postCard}>
        <View style={styles.postHeader}>
          <View style={styles.postUser}>
            <Image source={{ uri: profileUser?.avatarUrl || defaultAvatar }} style={styles.postAvatar} />
            <View>
              <Text style={styles.postUserName}>{profileUser?.userName}</Text>
              <Text style={styles.postTime}>{item.location}</Text>
              <Text style={styles.postTime}>{item.time}</Text>
            </View>
          </View>
          {isOwnProfile && (
            <TouchableOpacity onPress={() => setShowPostOptions(showPostOptions === item.id ? null : item.id)}>
              <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {isOwnProfile && showPostOptions === item.id && (
          <View style={styles.postOptions}>
            <TouchableOpacity
              style={styles.postOption}
              onPress={() => {
                onEditPost(item)
                setShowPostOptions(null)
              }}
            >
              <Ionicons name="pencil-outline" size={20} color={COLORS.primary} />
              <Text style={styles.postOptionText}>Chỉnh sửa</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.postOption}
              onPress={() => onDeletePost(item.id)}
            >
              <Ionicons name="trash-outline" size={20} color={COLORS.red} />
              <Text style={[styles.postOptionText, { color: COLORS.red }]}>Xóa</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.postContent}>{item.content}</Text>

        {item.images && item.images[0] && (
          <Image source={{ uri: item.images[0] }} style={styles.postImage} />
        )}

        <View style={styles.postStats}>
          <View style={styles.postLikes}>
            <TouchableOpacity onPress={handleLike} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AntDesign
                name={"heart"}
                size={12}
                color={COLORS.red}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.statsText}>{likesCount}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleOpenCommentsModal}>
            <Text style={styles.statsText}>{commentsCount} bình luận</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.postActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <AntDesign
              name={isLiked ? "heart" : "hearto"}
              size={22}
              color={isLiked ? COLORS.red : "#666"}
            />
            <Text style={styles.actionText}>Thích</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleOpenCommentsModal}>
            <Ionicons name="chatbubble-outline" size={22} color="#666" />
            <Text style={styles.actionText}>Bình luận</Text>
          </TouchableOpacity>
        </View>

        {commentsCount > 0 && (
          <TouchableOpacity style={{ paddingHorizontal: 15, marginTop: 5 }} onPress={handleOpenCommentsModal}>
            <Text style={{ color: COLORS.grey }}>
              {isLoadingComments ? 'Đang tải bình luận...' : `Xem tất cả ${commentsCount} bình luận`}
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, borderTopWidth: 1, borderTopColor: COLORS.lightGrey, marginTop: 10 }}>
          {user?.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} style={{ width: 30, height: 30, borderRadius: 15, marginRight: 10 }} />
          ) : (
            <Ionicons name="person-circle-outline" style={{ marginRight: 10 }} size={30} color={COLORS.grey} />
          )}
          <TextInput
            style={{ flex: 1, height: 40, borderColor: COLORS.lightGrey, borderWidth: 1, borderRadius: 20, paddingHorizontal: 15 }}
            placeholder="Thêm bình luận..."
            placeholderTextColor={COLORS.grey}
            value={commentText}
            onChangeText={setCommentText}
            editable={!isSubmittingComment}
          />
          <TouchableOpacity onPress={handleComment} disabled={isSubmittingComment} style={{ marginLeft: 10, padding: 8 }}>
            <Text style={[{ color: COLORS.primary, fontWeight: 'bold' }, isSubmittingComment && { opacity: 0.5 }]}>
              {isSubmittingComment ? "Đang đăng..." : "Đăng"}
            </Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isCommentsModalVisible}
          onRequestClose={() => setIsCommentsModalVisible(false)}
        >
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
            activeOpacity={1}
            onPressOut={() => setIsCommentsModalVisible(false)}
          >
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <View style={{ backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '70%' }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' }}>Bình luận</Text>
                {isLoadingComments && !allComments.length ? (
                  <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 20 }} />
                ) : (
                  <FlatList
                    data={allComments}
                    renderItem={renderCommentItemModal}
                    keyExtractor={(c) => c.id.toString()}
                    ListEmptyComponent={<Text style={{ paddingVertical: 10, textAlign: 'center' }}>Chưa có bình luận nào.</Text>}
                  />
                )}
                <TouchableOpacity
                  style={{ backgroundColor: COLORS.primary, padding: 12, borderRadius: 20, alignItems: 'center', marginTop: 15 }}
                  onPress={() => setIsCommentsModalVisible(false)}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Đóng</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  };

  const renderPost = ({ item }: { item: Post }) => <PostItem item={item} />;

  return (
    <View style={styles.postsContainer}>
      {isOwnProfile && (
        <View style={styles.createPostCard}>
          <View style={styles.createPostHeader}>
            <Image source={{ uri: profileUser?.avatarUrl || defaultAvatar }} style={styles.createPostAvatar} />
            <TouchableOpacity style={styles.createPostInput} onPress={onCreatePost}>
              <Text style={styles.createPostPlaceholder}>Bạn đang nghĩ gì?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.createPostActions}>
            <TouchableOpacity style={styles.createPostAction} onPress={onCreatePost}>
              <Ionicons name="image-outline" size={20} color={COLORS.green} />
              <Text style={styles.createPostActionText}>Ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.createPostAction} onPress={onCreatePost}>
              <Ionicons name="location-outline" size={20} color={COLORS.blue} />
              <Text style={styles.createPostActionText}>Check in</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </View>
  )
}

const localStyles = StyleSheet.create({
  commentItemContainer: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
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
    borderColor: COLORS.lightGrey,
    borderWidth: 1,
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