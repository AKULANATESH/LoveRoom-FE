import {
  Favorite as FavoriteIcon,
  Mood as MoodIcon,
  PsychologyAlt as PsychologyAltIcon,
  VolunteerActivism as HugIcon,
} from "@mui/icons-material";
import { Box, Chip, CircularProgress, Stack, Typography, alpha } from "@mui/material";
import type { SvgIconComponent } from "@mui/icons-material";
import { useAuthContext } from "@src/auth/useAuth";
import { environmentConfig } from "@src/environment";
import { queryClient } from "@src/api";
import type { ReactElement } from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";

import { usePartnerActivity, partnerActivityQueryKey } from "../api/usePartnerActivity";
import type { EmotionalActionType, PartnerActivityItem } from "../types";

const actionIcons: Record<EmotionalActionType, SvgIconComponent> = {
  HUG: HugIcon,
  KISS: FavoriteIcon,
  MISS_YOU: FavoriteIcon,
  THINKING_OF_YOU: PsychologyAltIcon,
};

function PartnerActivityItemRow({ item }: { item: PartnerActivityItem }): ReactElement {
  if (item.kind === "ACTION") {
    const Icon = actionIcons[item.actionType];

    return (
      <Box
        sx={{
          p: 1.5,
          borderRadius: 3,
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.06),
        }}
      >
        <Stack direction="row" spacing={1.2} alignItems="flex-start">
          <Icon color="primary" sx={{ fontSize: 20, mt: 0.2 }} />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" fontWeight={700} lineHeight={1.3}>
              {item.label}
            </Typography>
            {item.message ? (
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                "{item.message}"
              </Typography>
            ) : null}
            <Typography variant="caption" color="text.secondary">
              {item.createdAtLabel}
            </Typography>
          </Box>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 3,
        bgcolor: "rgba(255, 205, 210, 0.35)",
      }}
    >
      <Stack direction="row" spacing={1.2} alignItems="flex-start">
        <MoodIcon color="primary" sx={{ fontSize: 20, mt: 0.2 }} />
        <Box sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={0.5} alignItems="center" useFlexGap flexWrap="wrap">
            <Typography variant="body2" fontWeight={700}>
              Shared mood
            </Typography>
            <Chip label={item.moodLabel} size="small" color="primary" />
          </Stack>
          {item.note ? (
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
              "{item.note}"
            </Typography>
          ) : null}
          <Typography variant="caption" color="text.secondary">
            {item.createdAtLabel}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

export function PartnerActivitySidebar(): ReactElement {
  const { authState } = useAuthContext();
  const partnerActivity = usePartnerActivity();

  useEffect(() => {
    const relationshipId = authState?.relationshipId;
    if (!relationshipId) {
      return undefined;
    }

    const socket = io(environmentConfig.BACKEND_API_URL, {
      transports: ["websocket"],
      query: { relationshipId },
    });

    socket.on("partner:activity", () => {
      void queryClient.invalidateQueries({ queryKey: partnerActivityQueryKey });
    });

    return () => {
      socket.disconnect();
    };
  }, [authState?.relationshipId]);

  return (
    <Box sx={{ px: 1, pb: 2 }}>
      <Typography variant="overline" color="text.secondary" sx={{ px: 1 }}>
        From your partner
      </Typography>
      <Typography variant="body2" fontWeight={700} sx={{ px: 1, mb: 0.5 }}>
        Hugs, kisses & moods
      </Typography>

      {partnerActivity.data?.emotionStats ? (
        <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap" sx={{ px: 1, mb: 1.5 }}>
          <Chip
            size="small"
            label={`Partner: ${partnerActivity.data.emotionStats.partnerSent}`}
            color="secondary"
            variant="outlined"
          />
          <Chip
            size="small"
            label={`You: ${partnerActivity.data.emotionStats.mySent}`}
            color="primary"
            variant="outlined"
          />
          <Chip
            size="small"
            label={`Both: ${partnerActivity.data.emotionStats.total}`}
            sx={{ fontWeight: 800 }}
          />
        </Stack>
      ) : null}

      {partnerActivity.isLoading ? (
        <Box sx={{ display: "grid", placeItems: "center", py: 3 }}>
          <CircularProgress size={22} />
        </Box>
      ) : null}

      {partnerActivity.isError ? (
        <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
          Could not load partner activity.
        </Typography>
      ) : null}

      {partnerActivity.data?.items.length === 0 ? (
        <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
          When your partner sends a hug, kiss, or mood, it will appear here.
        </Typography>
      ) : null}

      <Stack spacing={1}>
        {partnerActivity.data?.items.map((item) => (
          <PartnerActivityItemRow key={`${item.kind}-${item.id}`} item={item} />
        ))}
      </Stack>
    </Box>
  );
}
