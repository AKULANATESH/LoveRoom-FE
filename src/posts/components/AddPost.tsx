import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import { type UseModalState } from "../../lib/modals/useModalState";
import { useCreatePost } from "../api/useCreatePost";

interface AddPostProps {
  modalState: UseModalState;
  onSuccess: () => void;
}

export function AddPost(props: AddPostProps) {
  const { modalState, onSuccess } = props;

  const { isPending: isCreatingPost, mutate: createPost } = useCreatePost({
    onSuccess: () => {
      onSuccess();
      modalState.closeModal();
    },
  });

  return (
    <Dialog open={modalState.modalIsOpen} onClose={modalState.closeModal}>
      <DialogTitle>Add Post</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Let Google help apps determine location. This means sending anonymous location data to
          Google, even when no apps are running.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={isCreatingPost}
          onClick={() => {
            createPost({
              title: "Hello",
              body: "Hello",
              userId: 1,
            });
          }}
        >
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}
