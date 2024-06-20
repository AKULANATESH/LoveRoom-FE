import { CircularProgress, List, ListItem, ListItemText, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useGetPosts } from "../api/useGetPosts";

export function Posts() {
  const navigate = useNavigate();

  const { isLoading: isGetPostsLoading, data: posts } = useGetPosts();

  if (isGetPostsLoading) {
    return (
      <Stack sx={{ height: "100%", alignItems: "center" }}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <List>
      {posts?.map((post) => (
        <ListItem
          key={post.id}
          sx={{ borderBottom: "1px solid" }}
          onClick={() => {
            navigate(`/posts/${post.id}`);
          }}
        >
          <ListItemText primary={post.title} secondary={post.body} />
        </ListItem>
      ))}
    </List>
  );
}
