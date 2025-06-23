import { useEffect, useState } from "react";
import { View } from "react-native";
import { styles } from "@/styles/forum.styles";
import { getAllPosts, getPostByUserId } from "@/services/post";
import { ForumTabs } from "@/components/forum/ForumTabs";
import { PostsList } from "@/components/forum/PostsList";
import { Post } from "@/models";
import { ForumCreatePost } from "@/components/forum/ForumCreatePost";
import { useUser } from "@/hooks/useUser";
import { Header } from "@/components/common/Header";

export default function ForumScreen() {
  const [activeTab, setActiveTab] = useState("Popular");
  const [posts, setPosts] = useState<Post[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchPosts = async () => {
      if (activeTab === "YourPost" && user?.id) {
        const res = await getPostByUserId(user.id);
        setPosts(res.response);
      } else {
        const res = await getAllPosts();
        setPosts(res.response);
      }
    };

    fetchPosts();
  }, [activeTab, user?.id]);

  const handleNewPost = (newPost: Post) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  return (
    <View style={styles.container}>
      <Header title="Diễn đàn" />
      <ForumCreatePost onPostCreated={handleNewPost}/>
      <ForumTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <PostsList posts={posts} />
    </View>
  );
}
