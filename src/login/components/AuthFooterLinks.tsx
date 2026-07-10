import { Button, Link, Stack } from "@mui/material";
import { useAuthContext } from "@src/auth/useAuth";
import type { ReactElement } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

interface AuthFooterLinksProps {
  showSignOut?: boolean;
  showJoinLink?: boolean;
  showHomeLink?: boolean;
}

export function AuthFooterLinks({
  showSignOut = false,
  showJoinLink = false,
  showHomeLink = false,
}: AuthFooterLinksProps): ReactElement {
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  return (
    <Stack spacing={1} sx={{ mt: 1 }}>
      {showJoinLink ? (
        <Link component={RouterLink} to="/join" underline="hover">
          Partner joining? Enter invite code
        </Link>
      ) : null}
      {showHomeLink ? (
        <Link component={RouterLink} to="/" underline="hover">
          Back to welcome
        </Link>
      ) : null}
      {showSignOut ? (
        <Button
          variant="text"
          color="inherit"
          onClick={() => {
            logout();
            navigate("/login");
          }}
          sx={{ alignSelf: "flex-start", px: 0 }}
        >
          Sign out
        </Button>
      ) : null}
    </Stack>
  );
}
