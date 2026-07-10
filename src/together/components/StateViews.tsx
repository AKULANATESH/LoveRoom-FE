import { FavoriteBorder as FavoriteBorderIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import { Box, Button, CircularProgress, Paper, Typography } from "@mui/material";
import type { ReactElement } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
}

export function LoadingState(): ReactElement {
  return (
    <Box
      role="status"
      aria-label="Loading your relationship space"
      sx={{ display: "grid", minHeight: 320, placeItems: "center" }}
    >
      <CircularProgress />
    </Box>
  );
}

export function EmptyState({ title, description }: EmptyStateProps): ReactElement {
  return (
    <Paper
      sx={{
        display: "grid",
        gap: 1,
        justifyItems: "center",
        p: 4,
        textAlign: "center",
      }}
    >
      <FavoriteBorderIcon color="primary" fontSize="large" />
      <Typography variant="h3">{title}</Typography>
      <Typography color="text.secondary">{description}</Typography>
    </Paper>
  );
}

interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps): ReactElement {
  return (
    <Paper sx={{ display: "grid", gap: 2, p: 4, textAlign: "center" }}>
      <Typography variant="h3">This shared space needs a refresh</Typography>
      <Typography color="text.secondary">
        We could not load the latest relationship moments. Try again in a heartbeat.
      </Typography>
      <Button startIcon={<RefreshIcon />} variant="contained" onClick={onRetry}>
        Try again
      </Button>
    </Paper>
  );
}
