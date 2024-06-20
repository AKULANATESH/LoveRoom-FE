import { DeleteOutline } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { isDefined } from "../../utils/isDefined";
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
      <Stack sx={{ height: "100%", alignItems: "center" }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (!isDefined(post) || !isDefined(postId)) {
    return <Box alignItems="center">No Data</Box>;
  }

  return (
    <Box sx={{ padding: 4 }}>
      <List>
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
        <Divider variant="inset" component="li" sx={{ margin: 0 }} />
        <CommentsList postId={postId} />
      </List>
    </Box>
  );
}
