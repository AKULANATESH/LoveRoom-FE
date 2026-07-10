import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Link, Stack } from "@mui/material";
import { useAcceptInvitation, usePreviewInvitation } from "@src/auth/api/useInvitations";
import { useRegister } from "@src/auth/api/useRegister";
import { useAuthContext } from "@src/auth/useAuth";
import { TextInputField } from "@src/lib/formFields/TextInputField";
import { useToast } from "@src/lib/notifications/useToast";
import type { ReactElement } from "react";
import { useEffect } from "react";
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

export function Register(): ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const inviteCode = (location.state as { inviteCode?: string } | null)?.inviteCode;
  const invitePreview = usePreviewInvitation(inviteCode);
  const { isAuthenticated, hasPartner, setAuthFromResponse } = useAuthContext();
  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: invitePreview.data?.inviteeEmail ?? "",
      username: invitePreview.data?.inviteeUsername ?? "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (invitePreview.data?.inviteeEmail) {
      form.setValue("email", invitePreview.data.inviteeEmail);
    }
    if (invitePreview.data?.inviteeUsername) {
      form.setValue("username", invitePreview.data.inviteeUsername);
    }
  }, [form, invitePreview.data]);

  const acceptInvitation = useAcceptInvitation({
    onSuccess: (response) => {
      setAuthFromResponse(response);
      toast.showSuccessToast("You are connected with your partner.");
      navigate("/together");
    },
    onError: () => {
      toast.showErrorToast("Account created, but invite acceptance failed. Try again from Join.");
      navigate("/invite");
    },
  });

  const register = useRegister({
    onSuccess: (response) => {
      setAuthFromResponse(response);
      toast.showSuccessToast("Your account is ready.");
      if (inviteCode) {
        acceptInvitation.mutate({ code: inviteCode });
        return;
      }
      navigate(response.hasPartner ? "/together" : "/invite");
    },
    onError: () => {
      toast.showErrorToast("Could not create your account. Check your details and try again.");
    },
  });

  if (isAuthenticated && hasPartner) {
    return <Navigate to="/together" />;
  }

  if (isAuthenticated && !hasPartner && inviteCode) {
    return <Navigate to={`/join/${inviteCode}`} />;
  }

  if (isAuthenticated) {
    return <Navigate to="/invite" />;
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle={
        inviteCode
          ? "Create your account to accept your partner’s invite."
          : "Start your shared space, then invite your partner by email or username."
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
          {invitePreview.data ? (
            <Alert severity="info">
              Joining invite from <strong>{invitePreview.data.inviterName}</strong>. Use the email
              and username shown on the invite.
            </Alert>
          ) : null}
          {register.isError ? (
            <Alert severity="error">
              Registration failed. Email or username may already exist.
            </Alert>
          ) : null}
          <TextInputField name="name" label="Your name" autoComplete="name" />
          <TextInputField name="email" label="Email" type="email" autoComplete="email" />
          <TextInputField
            name="username"
            label="Username"
            helperText="Your partner can use this to find your invite"
          />
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
          <Link
            component={RouterLink}
            to="/login"
            state={{ inviteCode }}
            underline="hover"
          >
            Already have an account? Sign in
          </Link>
        </Stack>
      </FormProvider>
    </AuthLayout>
  );
}
