import { Add as AddIcon } from "@mui/icons-material";
import { CircularProgress, Fab, List, ListItem, ListItemText, Stack } from "@mui/material";
import { useModalState } from "@src/lib/modals/useModalState";
import { useNavigate } from "react-router-dom";

import { useGetPosts } from "../api/useGetPosts";
import { AddPostForm } from "../components/AddPostForm";

export function Posts() {
  const navigate = useNavigate();
  const addPostModalState = useModalState();

  const { isLoading: isGetPostsLoading, data: posts, refetch: refetchPosts } = useGetPosts();

  if (isGetPostsLoading) {
    return (
      <Stack sx={{ height: "100%", alignItems: "center" }}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <>
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
      <Fab
        color="primary"
        aria-label="Add Post"
        sx={{
          position: "fixed",
          bottom: (theme) => theme.spacing(3),
          right: (theme) => theme.spacing(3),
        }}
        onClick={() => {
          addPostModalState.openModal();
        }}
      >
        <AddIcon />
      </Fab>
      <AddPostForm
        modalState={addPostModalState}
        onSuccess={() => {
          refetchPosts();
        }}
      />
    </>
  );
}
