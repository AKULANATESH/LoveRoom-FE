import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { type UseModalState } from "../../lib/modals/useModalState";
import { useCreatePost } from "../api/useCreatePost";

interface AddPostFormProps {
  modalState: UseModalState;
  onSuccess: () => void;
}

const addPostFormSchema = z.object({
  title: z.string().min(3),
  body: z.string().min(10),
});
type AddPostFormFields = z.infer<typeof addPostFormSchema>;

export function AddPostForm(props: AddPostFormProps) {
  const { modalState, onSuccess } = props;

  const { isPending: isCreatingPost, mutate: createPost } = useCreatePost({
    onSuccess: () => {
      onSuccess();
      modalState.closeModal();
    },
  });

  const formMethods = useForm<AddPostFormFields>({
    defaultValues: {
      title: "",
      body: "",
    },
    resolver: zodResolver(addPostFormSchema),
    mode: "onChange",
  });
  const {
    handleSubmit,
    formState: { errors, isSubmitting, isValid: formIsValid },
    register,
  } = formMethods;

  return (
    <Dialog open={modalState.modalIsOpen} onClose={modalState.closeModal}>
      <FormProvider {...formMethods}>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column" }}
          onSubmit={handleSubmit((formData) => {
            createPost({
              ...formData,
              userId: 1,
            });
          })}
        >
          <DialogTitle>Add Post</DialogTitle>
          <DialogContent sx={{ "&.MuiDialogContent-root": { paddingTop: 2 } }}>
            <TextField
              fullWidth
              sx={{ marginBottom: 2 }}
              label="Title for post"
              placeholder="Post Title"
              {...register("title")}
              error={Boolean(errors.title)}
              helperText={errors.title?.message}
            />
            <TextField
              fullWidth
              multiline
              sx={{ marginBottom: 2 }}
              label="Body for post"
              placeholder="Minimum 10 characters"
              rows={4}
              {...register("body")}
              error={Boolean(errors.body)}
              helperText={errors.body?.message}
            />
          </DialogContent>
          <DialogActions>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={isCreatingPost || isSubmitting || !formIsValid}
            >
              Submit
            </Button>
          </DialogActions>
        </Box>
      </FormProvider>
    </Dialog>
  );
}
