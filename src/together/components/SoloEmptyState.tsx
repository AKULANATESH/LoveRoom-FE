import { PersonAdd as PersonAddIcon } from "@mui/icons-material";
import { Button, Paper, Stack, Typography } from "@mui/material";
import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";

import { soloModeCopy, type SoloPageKey } from "../soloModeCopy";

interface SoloEmptyStateProps {
  page: SoloPageKey;
  showInviteButton?: boolean;
}

export function SoloEmptyState({
  page,
  showInviteButton = true,
}: SoloEmptyStateProps): ReactElement {
  const navigate = useNavigate();
  const copy = soloModeCopy[page];

  return (
    <Paper
      sx={{
        display: "grid",
        gap: 2,
        justifyItems: "center",
        p: 4,
        textAlign: "center",
      }}
    >
      <Typography variant="h3">{copy.title}</Typography>
      <Typography color="text.secondary">{copy.description}</Typography>
      {copy.hint ? (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
          {copy.hint}
        </Typography>
      ) : null}
      {showInviteButton ? (
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => navigate("/invite")}
        >
          Invite partner
        </Button>
      ) : null}
    </Paper>
  );
}

interface SoloBannerProps {
  page: SoloPageKey;
}

export function SoloBanner({ page }: SoloBannerProps): ReactElement {
  const navigate = useNavigate();
  const copy = soloModeCopy[page];

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      alignItems={{ xs: "stretch", sm: "center" }}
      justifyContent="space-between"
      sx={{
        p: 2,
        borderRadius: 4,
        bgcolor: "rgba(255, 205, 210, 0.35)",
        border: "1px solid rgba(233, 30, 99, 0.15)",
      }}
    >
      <Stack spacing={0.5}>
        <Typography variant="subtitle1" fontWeight={700}>
          {copy.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {copy.description}
        </Typography>
      </Stack>
      <Button variant="outlined" size="small" onClick={() => navigate("/invite")}>
        Invite partner
      </Button>
    </Stack>
  );
}
