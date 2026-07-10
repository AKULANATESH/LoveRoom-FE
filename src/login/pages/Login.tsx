import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Link, Stack, Typography } from "@mui/material";
import { getApiErrorMessage } from "@src/api/getApiErrorMessage";
import { useAcceptInvitation, usePreviewInvitation } from "@src/auth/api/useInvitations";
import { useLogin } from "@src/auth/api/useLogin";
import { useAuthContext } from "@src/auth/useAuth";
import { TextInputField } from "@src/lib/formFields/TextInputField";
import { useToast } from "@src/lib/notifications/useToast";
import type { ReactElement } from "react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link as RouterLink, Navigate, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

import { AuthFooterLinks } from "../components/AuthFooterLinks";
import { AuthLayout } from "../components/AuthLayout";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Enter your password"),
});

type LoginForm = z.infer<typeof loginSchema>;

interface LoginLocationState {
  inviteCode?: string;
  inviteEmail?: string;
}

export function Login(): ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { isAuthenticated, hasPartner, authState, setAuthFromResponse, logout } = useAuthContext();
  const locationState = (location.state as LoginLocationState | null) ?? {};
  const inviteCode = locationState.inviteCode;
  const inviteEmailFromState = locationState.inviteEmail;
  const invitePreview = usePreviewInvitation(inviteCode);
  const inviteEmail = inviteEmailFromState ?? invitePreview.data?.inviteeEmail ?? "";

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: inviteEmail,
      password: "",
    },
  });

  useEffect(() => {
    if (inviteEmail) {
      form.setValue("email", inviteEmail);
    }
  }, [form, inviteEmail]);

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
        getApiErrorMessage(error, "Signed in, but invite acceptance failed."),
      );
      navigate(`/join/${inviteCode}`);
    },
  });

  const login = useLogin({
    onSuccess: (response) => {
      setAuthFromResponse(response);
      toast.showSuccessToast("Welcome back.");
      if (inviteCode) {
        acceptInvitation.mutate({ code: inviteCode });
        return;
      }
      if (response.hasPartner) {
        navigate("/together");
        return;
      }
      navigate("/invite");
    },
    onError: () => {
      toast.showErrorToast("Invalid email or password.");
    },
  });

  if (isAuthenticated && hasPartner) {
    return <Navigate to="/together" />;
  }

  if (isAuthenticated && !inviteCode) {
    return (
      <AuthLayout
        title="You are already signed in"
        subtitle="Continue inviting your partner, or sign out to use a different account."
      >
        <Stack spacing={2}>
          <Typography color="text.secondary">
            Signed in as <strong>{authState?.user.name}</strong> ({authState?.user.email})
          </Typography>
          <Button variant="contained" size="large" onClick={() => navigate("/invite")}>
            Continue to invite
          </Button>
          <AuthFooterLinks showSignOut showHomeLink showJoinLink />
        </Stack>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={inviteCode ? "Sign in with invite code" : "Sign in"}
      subtitle={
        inviteCode
          ? `Sign in to accept invite ${inviteCode}${inviteEmail ? ` for ${inviteEmail}` : ""}.`
          : "Return to your shared relationship space."
      }
    >
      <FormProvider {...form}>
        <Stack
          component="form"
          spacing={2}
          onSubmit={form.handleSubmit((values) => login.mutate(values))}
        >
          {inviteCode ? (
            <Alert severity="info">
              After sign-in, your invite <strong>{inviteCode}</strong> will be accepted
              automatically.
            </Alert>
          ) : null}
          {login.isError ? <Alert severity="error">Invalid email or password.</Alert> : null}
          <TextInputField name="email" label="Email" type="email" autoComplete="email" />
          <TextInputField
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
          />
          <Button type="submit" variant="contained" size="large" disabled={login.isPending}>
            {login.isPending
              ? "Signing in..."
              : inviteCode
                ? "Sign in and accept invite"
                : "Sign in"}
          </Button>
          <Link
            component={RouterLink}
            to="/register"
            state={{ inviteCode, inviteEmail }}
            underline="hover"
          >
            New here? Create an account
          </Link>
          {inviteCode ? (
            <Link component={RouterLink} to={`/join/${inviteCode}`} underline="hover">
              Back to invite code
            </Link>
          ) : null}
          <AuthFooterLinks showHomeLink showJoinLink={!inviteCode} />
        </Stack>
      </FormProvider>
    </AuthLayout>
  );
}
