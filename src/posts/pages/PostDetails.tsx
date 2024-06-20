import { Box, CircularProgress, Divider, List, ListItem, ListItemText, Stack } from "@mui/material";
import { useParams } from "react-router-dom";

import { isDefined } from "../../utils/isDefined";
import { useGetPost } from "../api/useGetPost";
import { CommentsList } from "../components/CommentsList";

export function PostDetails() {
  const { postId } = useParams<{ postId: string }>();

  const { isLoading: isGetPostLoading, data: post } = useGetPost(
    { postId: postId ?? "" },
    { enabled: isDefined(postId) },
  );

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
        <ListItem>
          <ListItemText primary={post.title} secondary={post.body} />
        </ListItem>
        <Divider variant="inset" component="li" sx={{ margin: 0 }} />
        <CommentsList postId={Number(postId)} />
      </List>
    </Box>
  );
}
