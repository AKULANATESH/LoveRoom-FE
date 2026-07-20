import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Stack, Typography } from "@mui/material";
import { getApiErrorMessage } from "@src/api/getApiErrorMessage";
import { useAcceptInvitation, usePreviewInvitation } from "@src/auth/api/useInvitations";
import { useAuthContext } from "@src/auth/useAuth";
import { TextInputField } from "@src/lib/formFields/TextInputField";
import { useToast } from "@src/lib/notifications/useToast";
import type { ReactElement } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

import { AuthFooterLinks } from "../components/AuthFooterLinks";
import { AuthLayout } from "../components/AuthLayout";

const joinSchema = z.object({
  code: z.string().min(6, "Enter the 6-character invite code").max(8),
});

type JoinForm = z.infer<typeof joinSchema>;

export function JoinWithCode(): ReactElement {
  const navigate = useNavigate();
  const { code: routeCode } = useParams();
  const toast = useToast();
  const { isAuthenticated, hasPartner, authState, setAuthFromResponse, logout } = useAuthContext();

  const form = useForm<JoinForm>({
    resolver: zodResolver(joinSchema),
    defaultValues: { code: routeCode?.toUpperCase() ?? "" },
  });

  const codeValue = form.watch("code").toUpperCase();
  const preview = usePreviewInvitation(codeValue.length >= 6 ? codeValue : undefined);

  const acceptInvitation = useAcceptInvitation({
    onSuccess: (response) => {
      setAuthFromResponse(response);
      toast.showSuccessToast("You are connected. Welcome to your shared space.");
      navigate("/together");
    },
    onError: (error) => {
      toast.showErrorToast(
        getApiErrorMessage(error, "Could not accept invite. Check the code and your account details."),
      );
    },
  });

  const inviteEmail = preview.data?.inviteeEmail ?? undefined;
  const inviteUsername = preview.data?.inviteeUsername ?? undefined;
  const currentEmail = authState?.user.email;
  const currentUsername = authState?.user.username;

  const emailMismatch = Boolean(
    isAuthenticated && inviteEmail && currentEmail && inviteEmail !== currentEmail,
  );
  const usernameMismatch = Boolean(
    isAuthenticated &&
      inviteUsername &&
      currentUsername &&
      inviteUsername !== currentUsername,
  );
  const accountMismatch = emailMismatch || usernameMismatch;

  function goToLoginWithInvite() {
    logout();
    navigate("/login", { state: { inviteCode: codeValue, inviteEmail } });
  }

  function goToRegisterWithInvite() {
    logout();
    navigate(`/register?code=${encodeURIComponent(codeValue)}`, {
      state: { inviteCode: codeValue, inviteEmail, inviteUsername },
    });
  }

  if (isAuthenticated && hasPartner) {
    return <Navigate to="/together" />;
  }

  return (
    <AuthLayout title="Join your partner" subtitle="Enter the invite code they shared with you.">
      <FormProvider {...form}>
        <Stack spacing={2}>
          {preview.data ? (
            <Alert severity="success">
              {preview.data.inviterName} invited you to join Together.
            </Alert>
          ) : null}
          {preview.isError ? <Alert severity="error">This invite code is not valid.</Alert> : null}

          <TextInputField
            name="code"
            label="Invite code"
            autoComplete="off"
            helperText="Example: ABC123"
            inputProps={{ style: { textTransform: "uppercase", letterSpacing: "0.2em" } }}
          />

          {inviteEmail ? (
            <Typography variant="body2" color="text.secondary">
              This invite was sent to <strong>{inviteEmail}</strong>.
            </Typography>
          ) : null}

          {inviteUsername ? (
            <Typography variant="body2" color="text.secondary">
              This invite expects the username <strong>{inviteUsername}</strong>.
            </Typography>
          ) : null}

          {isAuthenticated ? (
            <Alert severity={accountMismatch ? "warning" : "info"}>
              Signed in as <strong>{currentEmail}</strong>
              {accountMismatch
                ? ". Use the buttons below to sign in with the invited account."
                : ". You can accept the invite below."}
            </Alert>
          ) : null}

          {isAuthenticated && !accountMismatch ? (
            <Button
              variant="contained"
              size="large"
              disabled={acceptInvitation.isPending || !preview.data}
              onClick={() => {
                acceptInvitation.mutate({ code: codeValue });
              }}
            >
              {acceptInvitation.isPending ? "Connecting..." : "Accept invite"}
            </Button>
          ) : null}

          {!isAuthenticated || accountMismatch ? (
            <Stack spacing={1.5}>
              <Button
                variant="contained"
                size="large"
                disabled={!preview.data}
                onClick={goToLoginWithInvite}
              >
                {inviteEmail
                  ? `Sign in with invite (${inviteEmail})`
                  : "Sign in with invite code"}
              </Button>
              <Button
                variant="outlined"
                size="large"
                disabled={!preview.data}
                onClick={goToRegisterWithInvite}
              >
                {inviteEmail ? `Create account (${inviteEmail})` : "Create account to join"}
              </Button>
            </Stack>
          ) : null}

          <AuthFooterLinks showHomeLink />
        </Stack>
      </FormProvider>
    </AuthLayout>
  );
}
