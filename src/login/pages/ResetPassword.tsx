import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Stack } from "@mui/material";
import { getApiErrorMessage } from "@src/api/getApiErrorMessage";
import { useResetPassword } from "@src/auth/api/useResetPassword";
import { TextInputField } from "@src/lib/formFields/TextInputField";
import { useToast } from "@src/lib/notifications/useToast";
import type { ReactElement } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";

import { AuthLayout } from "../components/AuthLayout";

const resetPasswordSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30)
      .regex(/^[a-zA-Z0-9_]+$/, "Use letters, numbers, and underscores only"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export function ResetPassword(): ReactElement {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const resetPassword = useResetPassword({
    onSuccess: (response) => {
      toast.showSuccessToast(response.message);
      navigate("/login");
    },
    onError: (error) => {
      toast.showErrorToast(
        getApiErrorMessage(error, "Could not update your account. Try the link again."),
      );
    },
  });

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AuthLayout
      title="Set your username & password"
      subtitle="Your partner created a shared LoveRoom account. Choose your username and a new password."
    >
      <FormProvider {...form}>
        <Stack
          component="form"
          spacing={2}
          onSubmit={form.handleSubmit((values) => {
            resetPassword.mutate({
              token,
              username: values.username,
              password: values.password,
            });
          })}
        >
          {resetPassword.isError ? (
            <Alert severity="error">
              {getApiErrorMessage(
                resetPassword.error,
                "This link may be invalid or expired.",
              )}
            </Alert>
          ) : null}
          <TextInputField name="username" label="Choose a username" autoComplete="username" />
          <TextInputField
            name="password"
            label="New password"
            type="password"
            autoComplete="new-password"
          />
          <TextInputField
            name="confirmPassword"
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={resetPassword.isPending}
          >
            {resetPassword.isPending ? "Saving..." : "Save and continue"}
          </Button>
        </Stack>
      </FormProvider>
    </AuthLayout>
  );
}
