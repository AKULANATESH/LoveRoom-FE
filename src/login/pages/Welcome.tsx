import { Button, Stack } from "@mui/material";
import { useAuthContext } from "@src/auth/useAuth";
import type { ReactElement } from "react";
import { Link as RouterLink, Navigate } from "react-router-dom";

import { AuthLayout } from "../components/AuthLayout";

export function Welcome(): ReactElement {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to="/together" />;
  }

  return (
    <AuthLayout
      title="Welcome to Together"
      subtitle="Create your account, explore the app, and invite your partner when you're ready."
    >
      <Stack spacing={1.5}>
        <Button component={RouterLink} to="/register" variant="contained" size="large">
          Create account
        </Button>
        <Button component={RouterLink} to="/login" variant="outlined" size="large">
          Sign in
        </Button>
        <Button component={RouterLink} to="/join" variant="text" size="large">
          Join with invite code
        </Button>
      </Stack>
    </AuthLayout>
  );
}
