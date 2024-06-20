import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
} from "@mui/material";

import { useGetPostComments } from "../api/useGetPostComments";

interface CommentsListProps {
  postId: number;
}

export function CommentsList(props: CommentsListProps) {
  const { postId } = props;

  const { isLoading: isGetPostCommentsLoading, data: comments = [] } = useGetPostComments({
    postId,
  });

  if (isGetPostCommentsLoading) {
    return (
      <Stack sx={{ height: "100%", alignItems: "center" }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (comments.length === 0) {
    return <Box alignItems="center">No Comments</Box>;
  }

  return (
    <List>
      {comments.map((comment) => (
        <>
          <ListItem>
            <ListItemAvatar>
              <Avatar />
            </ListItemAvatar>
            <ListItemText primary={comment.name} secondary={comment.body} />
          </ListItem>
          <Divider variant="inset" component="li" sx={{ margin: 0 }} />
        </>
      ))}
    </List>
  );
}
