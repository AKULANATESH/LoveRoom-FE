import type { SvgIconComponent } from "@mui/icons-material";
import {
  Favorite as FavoriteIcon,
  LocalFlorist as LocalFloristIcon,
  PsychologyAlt as PsychologyAltIcon,
  VolunteerActivism as VolunteerActivismIcon,
} from "@mui/icons-material";
import { alpha, Box, ButtonBase, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import type { ReactElement } from "react";

import type { EmotionalActionType } from "../types";

interface QuickActionConfig {
  type: EmotionalActionType;
  label: string;
  description: string;
  icon: SvgIconComponent;
}

const quickActions: QuickActionConfig[] = [
  {
    type: "HUG",
    label: "Send Hug",
    description: "A warm hold from afar",
    icon: VolunteerActivismIcon,
  },
  {
    type: "KISS",
    label: "Send Kiss",
    description: "A soft little spark",
    icon: FavoriteIcon,
  },
  {
    type: "MISS_YOU",
    label: "Miss You",
    description: "Let them feel wanted",
    icon: LocalFloristIcon,
  },
  {
    type: "THINKING_OF_YOU",
    label: "Thinking",
    description: "A quiet reminder",
    icon: PsychologyAltIcon,
  },
];

interface QuickActionsProps {
  activeAction?: EmotionalActionType;
  onSend: (type: EmotionalActionType) => void;
}

export function QuickActions({ activeAction, onSend }: QuickActionsProps): ReactElement {
  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h3">Send a feeling</Typography>
          <Typography color="text.secondary">
            One tap should be enough to make your partner feel remembered.
          </Typography>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" },
            gap: 1.5,
          }}
        >
          {quickActions.map((action) => {
            const Icon = action.icon;
            const isLoading = activeAction === action.type;

            return (
              <ButtonBase
                key={action.type}
                aria-label={action.label}
                disabled={Boolean(activeAction)}
                onClick={() => onSend(action.type)}
                sx={{
                  minHeight: 132,
                  alignItems: "stretch",
                  borderRadius: 5,
                  transition: "transform 180ms ease, box-shadow 180ms ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                  },
                  "&:focus-visible": {
                    outline: "3px solid",
                    outlineColor: "primary.main",
                  },
                }}
              >
                <Stack
                  spacing={1}
                  sx={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 2,
                    borderRadius: 5,
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.07),
                    border: "1px solid",
                    borderColor: "rgba(233, 30, 99, 0.12)",
                    textAlign: "center",
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={26} />
                  ) : (
                    <Icon color="primary" sx={{ fontSize: 32 }} />
                  )}
                  <Typography fontWeight={800}>{action.label}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {action.description}
                  </Typography>
                </Stack>
              </ButtonBase>
            );
          })}
        </Box>
      </Stack>
    </Paper>
  );
}
