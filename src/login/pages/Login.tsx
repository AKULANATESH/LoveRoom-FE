import { Box, Button } from "@mui/material";
import { useAuthContext } from "@src/auth/useAuth";
import { type ReactElement } from "react";
import { Navigate, useNavigate } from "react-router-dom";

export function Login(): ReactElement {
  const { setAuthUser, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
      <Button
        variant="outlined"
        onClick={() => {
          setAuthUser({ userId: "user-id", name: "Test User" });
          navigate("/");
        }}
      >
        Login
      </Button>
    </Box>
  );
}
