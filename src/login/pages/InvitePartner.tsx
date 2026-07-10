import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box, Button, Chip, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useCreateInvitation } from "@src/auth/api/useInvitations";
import { useAuthContext } from "@src/auth/useAuth";
import { TextInputField } from "@src/lib/formFields/TextInputField";
import { useToast } from "@src/lib/notifications/useToast";
import { type ReactElement, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { z } from "zod";

import { AuthFooterLinks } from "../components/AuthFooterLinks";
import { AuthLayout } from "../components/AuthLayout";

const emailInviteSchema = z.object({
  partnerEmail: z.string().email("Enter your partner's email"),
});

const usernameInviteSchema = z.object({
  partnerUsername: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, "Use letters, numbers, and underscores only"),
});

type EmailInviteForm = z.infer<typeof emailInviteSchema>;
type UsernameInviteForm = z.infer<typeof usernameInviteSchema>;

export function InvitePartner(): ReactElement {
  const toast = useToast();
  const { isAuthenticated, hasPartner, authState, updateAuthState } = useAuthContext();
  const [tab, setTab] = useState<"email" | "username">("email");
  const [inviteCode, setInviteCode] = useState(authState?.pendingInviteCode);

  const emailForm = useForm<EmailInviteForm>({
    resolver: zodResolver(emailInviteSchema),
    defaultValues: { partnerEmail: "" },
  });

  const usernameForm = useForm<UsernameInviteForm>({
    resolver: zodResolver(usernameInviteSchema),
    defaultValues: { partnerUsername: "" },
  });

  const createInvitation = useCreateInvitation({
    onSuccess: (response) => {
      setInviteCode(response.code);
      updateAuthState({ pendingInviteCode: response.code });
      toast.showSuccessToast("Invite created. Share the code with your partner.");
    },
    onError: () => {
      toast.showErrorToast("Could not create invite. Please try again.");
    },
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (hasPartner) {
    return <Navigate to="/together" />;
  }

  return (
    <AuthLayout
      title="Invite your partner"
      subtitle="Send an invite by email or username. Your partner joins with the code below."
    >
      <Stack spacing={2.5}>
        <Tabs value={tab} onChange={(_event, value: "email" | "username") => setTab(value)}>
          <Tab value="email" label="By email" />
          <Tab value="username" label="By username" />
        </Tabs>

        {tab === "email" ? (
          <FormProvider {...emailForm}>
            <Stack
              component="form"
              spacing={2}
              onSubmit={emailForm.handleSubmit((values) => {
                createInvitation.mutate({ partnerEmail: values.partnerEmail });
              })}
            >
              <TextInputField
                name="partnerEmail"
                label="Partner email"
                type="email"
                autoComplete="off"
                helperText="They should sign up with this email to accept the invite"
              />
              <Button type="submit" variant="contained" disabled={createInvitation.isPending}>
                Create invite
              </Button>
            </Stack>
          </FormProvider>
        ) : (
          <FormProvider {...usernameForm}>
            <Stack
              component="form"
              spacing={2}
              onSubmit={usernameForm.handleSubmit((values) => {
                createInvitation.mutate({ partnerUsername: values.partnerUsername });
              })}
            >
              <TextInputField
                name="partnerUsername"
                label="Partner username"
                autoComplete="off"
                helperText="They should choose this username when creating their account"
              />
              <Button type="submit" variant="contained" disabled={createInvitation.isPending}>
                Create invite
              </Button>
            </Stack>
          </FormProvider>
        )}

        {inviteCode ? (
          <Box
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: "rgba(255, 205, 210, 0.42)",
              textAlign: "center",
            }}
          >
            <Typography color="text.secondary">Your invite code</Typography>
            <Chip
              label={inviteCode}
              color="primary"
              sx={{ mt: 1, fontSize: 24, fontWeight: 800, px: 2, py: 3 }}
            />
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              Share this code with your partner. Once they join, your shared space will open.
            </Typography>
          </Box>
        ) : (
          <Alert severity="info">
            Waiting for your partner? Create an invite and share the code with them.
          </Alert>
        )}

        <AuthFooterLinks showSignOut showJoinLink showHomeLink />
      </Stack>
    </AuthLayout>
  );
}
