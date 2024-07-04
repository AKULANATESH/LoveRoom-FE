import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { TextInputField } from "@src/lib/formFields/TextInputField";
import { type UseModalState } from "@src/lib/modals/useModalState";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

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
    formState: { isSubmitting, isValid: formIsValid },
    reset,
  } = formMethods;

  const { isPending: isCreatingPost, mutate: createPost } = useCreatePost({
    onSuccess: () => {
      onSuccess();
      modalState.closeModal();
      reset();
    },
  });

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
            <TextInputField
              fullWidth
              sx={{ marginBottom: 2 }}
              label="Title for post"
              placeholder="Post Title"
              name={"title"}
            />
            <TextInputField
              fullWidth
              multiline
              sx={{ marginBottom: 2 }}
              label="Body for post"
              placeholder="Minimum 10 characters"
              rows={4}
              name={"body"}
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
