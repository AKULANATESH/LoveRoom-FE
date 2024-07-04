import { Box, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import { FullScreenPageLayout } from "./FullScreenPageLayout";

export function NotFoundPage() {
  return (
    <FullScreenPageLayout>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Stack spacing={2} alignItems="center">
          <Typography variant="h1">Page Not Found</Typography>
          <Typography variant="body1">
            <Link to="/">Go to Home Page</Link>
          </Typography>
        </Stack>
      </Box>
    </FullScreenPageLayout>
  );
}
