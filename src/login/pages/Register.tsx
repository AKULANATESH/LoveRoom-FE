import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Link, Stack } from "@mui/material";
import { getApiErrorMessage } from "@src/api/getApiErrorMessage";
import { useAcceptInvitation, usePreviewInvitation } from "@src/auth/api/useInvitations";
import { useRegister } from "@src/auth/api/useRegister";
import { useAuthContext } from "@src/auth/useAuth";
import { TextInputField } from "@src/lib/formFields/TextInputField";
import { useToast } from "@src/lib/notifications/useToast";
import type { ReactElement } from "react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link as RouterLink, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
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
  inviteUsername?: string;
}

export function Register(): ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const { isAuthenticated, setAuthFromResponse, logout } = useAuthContext();
  const locationState = (location.state as RegisterLocationState | null) ?? {};
  const inviteCode =
    locationState.inviteCode ?? searchParams.get("code")?.toUpperCase() ?? undefined;
  const invitePreview = usePreviewInvitation(inviteCode);
  const inviteEmail =
    locationState.inviteEmail ?? invitePreview.data?.inviteeEmail ?? "";
  const inviteUsername =
    locationState.inviteUsername ?? invitePreview.data?.inviteeUsername ?? "";

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: inviteEmail,
      username: inviteUsername,
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (inviteEmail) {
      form.setValue("email", inviteEmail);
    }
  }, [form, inviteEmail]);

  useEffect(() => {
    if (inviteUsername) {
      form.setValue("username", inviteUsername);
    }
  }, [form, inviteUsername]);

  useEffect(() => {
    if (inviteCode && isAuthenticated) {
      logout();
    }
  }, [inviteCode, isAuthenticated, logout]);

  const acceptInvitation = useAcceptInvitation({
    onSuccess: (response) => {
      setAuthFromResponse(response);
      toast.showSuccessToast("You are connected with your partner.");
      navigate("/together");
    },
    onError: (error) => {
      toast.showErrorToast(
        getApiErrorMessage(error, "Account created, but invite acceptance failed."),
      );
      navigate(`/join/${inviteCode}`);
    },
  });

  const register = useRegister({
    onSuccess: (response) => {
      setAuthFromResponse(response);
      if (inviteCode) {
        acceptInvitation.mutate({ code: inviteCode });
        return;
      }
      toast.showSuccessToast("Welcome to Together. Explore the app and invite your partner when ready.");
      navigate("/together");
    },
    onError: (error) => {
      toast.showErrorToast(
        getApiErrorMessage(error, "Could not create your account. Check details and try again."),
      );
    },
  });

  if (isAuthenticated && !inviteCode) {
    return <Navigate to="/together" />;
  }

  return (
    <AuthLayout
      title={inviteCode ? "Create account to join" : "Create your account"}
      subtitle={
        inviteCode
          ? `Sign up to accept invite ${inviteCode}${inviteEmail ? ` for ${inviteEmail}` : ""}.`
          : "Sign up solo. Invite your partner later from inside the app."
      }
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
          {inviteCode ? (
            <Alert severity="info">
              After sign-up, your invite <strong>{inviteCode}</strong> will be accepted
              automatically.
            </Alert>
          ) : null}
          {invitePreview.data ? (
            <Alert severity="success">
              {invitePreview.data.inviterName} invited you to join Together.
            </Alert>
          ) : null}
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
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={register.isPending || acceptInvitation.isPending}
          >
            {register.isPending || acceptInvitation.isPending
              ? "Creating account..."
              : inviteCode
                ? "Create account and join"
                : "Create account"}
          </Button>
          <Link
            component={RouterLink}
            to={inviteCode ? `/login?code=${encodeURIComponent(inviteCode)}` : "/login"}
            state={inviteCode ? { inviteCode, inviteEmail } : undefined}
            underline="hover"
          >
            Already have an account? Sign in
          </Link>
          {inviteCode ? (
            <Link component={RouterLink} to={`/join/${inviteCode}`} underline="hover">
              Back to invite code
            </Link>
          ) : null}
        </Stack>
      </FormProvider>
    </AuthLayout>
  );
}
