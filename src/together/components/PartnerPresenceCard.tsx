import { Circle, Favorite, WifiTethering } from "@mui/icons-material";
import { alpha, Avatar, Box, Chip, Paper, Stack, Typography } from "@mui/material";
import type { ReactElement } from "react";

import type { Partner, EmotionStats } from "../types";

interface PartnerPresenceCardProps {
  partner: Partner;
  partnerIsOnline: boolean;
  latestActivity: string;
  emotionStats?: EmotionStats;
}

export function PartnerPresenceCard({
  partner,
  partnerIsOnline,
  latestActivity,
  emotionStats,
}: PartnerPresenceCardProps): ReactElement {
  const onlineLabel = partnerIsOnline ? "Together now" : partner.presence.lastActiveLabel;

  return (
    <Paper
      aria-label={`${partner.name} presence`}
      sx={{
        position: "relative",
        overflow: "hidden",
        p: { xs: 3, sm: 4 },
        border: "1px solid",
        borderColor: "rgba(233, 30, 99, 0.12)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: "auto -60px -80px auto",
          width: 220,
          height: 220,
          borderRadius: "50%",
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
        }}
      />
      <Stack spacing={3} sx={{ position: "relative" }}>
        <Stack direction="row" spacing={2.5} alignItems="center">
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={partner.avatarUrl}
              alt={partner.name}
              sx={{
                width: 86,
                height: 86,
                bgcolor: "primary.main",
                fontSize: 34,
                fontWeight: 800,
              }}
            >
              {partner.name.charAt(0)}
            </Avatar>
            <Circle
              aria-hidden
              sx={{
                position: "absolute",
                right: 4,
                bottom: 6,
                color: partnerIsOnline ? "success.main" : "text.secondary",
                filter: partnerIsOnline ? "drop-shadow(0 0 8px rgba(76, 175, 80, 0.7))" : "none",
              }}
            />
          </Box>
          <Box>
            <Typography variant="overline" color="text.secondary">
              Your partner
            </Typography>
            <Typography variant="h2">{partner.name}</Typography>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
              <Chip
                icon={<WifiTethering />}
                label={onlineLabel}
                color={partnerIsOnline ? "success" : "default"}
                size="small"
              />
              <Chip icon={<Favorite />} label={partner.moodLabel} color="primary" size="small" />
            </Stack>
          </Box>
        </Stack>
        <Box>
          <Typography color="text.secondary">Right now</Typography>
          <Typography variant="h4">{latestActivity}</Typography>
        </Box>

        {emotionStats ? (
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <Chip
              label={`${partner.name}: ${emotionStats.partnerSent} emotions`}
              size="small"
              color="secondary"
              variant="outlined"
            />
            <Chip
              label={`You: ${emotionStats.mySent} emotions`}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip
              label={`Together: ${emotionStats.total}`}
              size="small"
              sx={{ fontWeight: 800 }}
            />
          </Stack>
        ) : null}
      </Stack>
    </Paper>
  );
}
