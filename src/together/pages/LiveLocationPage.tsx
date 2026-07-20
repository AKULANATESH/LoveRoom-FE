import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import { useAuthContext } from "@src/auth/useAuth";
import type { ReactElement } from "react";

import { LiveLocationView } from "../components/LiveLocationView";
import { SoloEmptyState } from "../components/SoloEmptyState";

export function LiveLocationPage(): ReactElement {
  const { hasPartner } = useAuthContext();

  if (!hasPartner) {
    return (
      <Container maxWidth="md" disableGutters sx={{ pb: 6 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="overline" color="text.secondary">
              Together
            </Typography>
            <Typography variant="h1">Live location</Typography>
          </Box>
          <SoloEmptyState page="location" />
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" disableGutters sx={{ pb: 6 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="overline" color="text.secondary">
            Together
          </Typography>
          <Typography variant="h1">Live location</Typography>
          <Typography color="text.secondary">
            See where your partner is and share yours in real time.
          </Typography>
        </Box>

        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
          <LiveLocationView />
        </Paper>
      </Stack>
    </Container>
  );
}
