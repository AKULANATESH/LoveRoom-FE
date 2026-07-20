import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Link, Stack } from "@mui/material";
import { getApiErrorMessage } from "@src/api/getApiErrorMessage";
import { useRegister } from "@src/auth/api/useRegister";
import { useAuthContext } from "@src/auth/useAuth";
import { TextInputField } from "@src/lib/formFields/TextInputField";
import { useToast } from "@src/lib/notifications/useToast";
import type { ReactElement } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link as RouterLink, Navigate, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

import { AuthLayout } from "../components/AuthLayout";

const registerSchema = z
  .object({
    name: z.string().min(2, "Enter your name"),
    email: z.string().email("Enter a valid email"),
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

type RegisterForm = z.infer<typeof registerSchema>;

interface RegisterLocationState {
  inviteCode?: string;
  inviteEmail?: string;
}

export function Register(): ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { isAuthenticated, setAuthFromResponse } = useAuthContext();
  const locationState = (location.state as RegisterLocationState | null) ?? {};
  const inviteEmail = locationState.inviteEmail ?? "";

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: inviteEmail,
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const register = useRegister({
    onSuccess: (response) => {
      setAuthFromResponse(response);
      toast.showSuccessToast("Welcome to Together. Explore the app and invite your partner when ready.");
      navigate("/together");
    },
    onError: (error) => {
      toast.showErrorToast(
        getApiErrorMessage(error, "Could not create your account. Check details and try again."),
      );
    },
  });

  if (isAuthenticated) {
    return <Navigate to="/together" />;
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Sign up solo. Invite your partner later from inside the app."
    >
      <FormProvider {...form}>
        <Stack
          component="form"
          spacing={2}
          onSubmit={form.handleSubmit((values) => {
            register.mutate({
              name: values.name,
              email: values.email,
              username: values.username,
              password: values.password,
            });
          })}
        >
          {register.isError ? (
            <Alert severity="error">
              {getApiErrorMessage(
                register.error,
                "Registration failed. Email or username may already exist.",
              )}
            </Alert>
          ) : null}
          <TextInputField name="name" label="Your name" autoComplete="name" />
          <TextInputField name="email" label="Your email" type="email" autoComplete="email" />
          <TextInputField name="username" label="Username" autoComplete="username" />
          <TextInputField
            name="password"
            label="Password"
            type="password"
            autoComplete="new-password"
          />
          <TextInputField
            name="confirmPassword"
            label="Confirm password"
            type="password"
            autoComplete="new-password"
          />
          <Button type="submit" variant="contained" size="large" disabled={register.isPending}>
            {register.isPending ? "Creating account..." : "Create account"}
          </Button>
          <Link component={RouterLink} to="/login" underline="hover">
            Already have an account? Sign in
          </Link>
        </Stack>
      </FormProvider>
    </AuthLayout>
  );
}
