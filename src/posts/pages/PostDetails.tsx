import { DeleteOutline } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material";
import { isDefined } from "@src/utils/isDefined";
import { useNavigate, useParams } from "react-router-dom";

import { useDeletePost } from "../api/useDeletePost";
import { useGetPost } from "../api/useGetPost";
import { CommentsList } from "../components/CommentsList";

export function PostDetails() {
  const navigate = useNavigate();

  const { postId: postIdString } = useParams<{ postId: string }>();
  const postId = Number(postIdString);

  const { isLoading: isGetPostLoading, data: post } = useGetPost(
    { postId: postId },
    { enabled: isDefined(postIdString) },
  );
  const { mutateAsync: deletePost, isPending: isDeletingPost } = useDeletePost({ postId });

  if (isGetPostLoading) {
    return (
      <Stack sx={{ height: "100%", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (!isDefined(post) || !isDefined(postId)) {
    return <Box alignItems="center">No Data</Box>;
  }

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <List sx={{ borderBottom: "1px solid" }}>
        <ListItem
          secondaryAction={
            <IconButton
              onClick={async () => {
                await deletePost();
                navigate("/posts");
              }}
              disabled={isDeletingPost}
            >
              <DeleteOutline />
            </IconButton>
          }
        >
          <ListItemText primary={post.title} secondary={post.body} />
        </ListItem>
      </List>
      <CommentsList postId={postId} />
    </Box>
  );
}
