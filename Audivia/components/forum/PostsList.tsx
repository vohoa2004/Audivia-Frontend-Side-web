import { FlatList } from "react-native";
import { ForumPost } from "./ForumPost";
import { Post } from "@/models";

interface PostsListProps {
  posts: Post[];
}

export const PostsList = ({ posts }: PostsListProps) => {
  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => <ForumPost item={item} />}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
    />
  );
}; 