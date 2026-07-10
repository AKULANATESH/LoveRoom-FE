import { Favorite, Lock } from "@mui/icons-material";
import { Box, Card, Chip, Stack, Typography } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps): ReactElement {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 2,
        py: 4,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 1040,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
          overflow: "hidden",
        }}
      >
        <Stack
          spacing={3}
          sx={{
            p: { xs: 3, sm: 5 },
            bgcolor: "primary.main",
            justifyContent: "center",
          }}
        >
          <Chip
            icon={<Lock />}
            label="Private space for two"
            sx={{
              alignSelf: "flex-start",
              bgcolor: "rgba(255, 255, 255, 0.18)",
              color: "white",
              fontWeight: 800,
            }}
          />
          <Box>
            <Typography variant="h1" color="white">
              Feel close, even when life pulls you apart.
            </Typography>
            <Typography color="rgba(255, 255, 255, 0.82)" sx={{ mt: 2, maxWidth: 520 }}>
              Together is a warm, private place for couples to share presence, moods, and little
              rituals that say, “I’m here.”
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <Chip icon={<Favorite />} label="Partner invite" sx={{ color: "white" }} />
            <Chip label="Invite by email or code" sx={{ color: "white" }} />
          </Stack>
        </Stack>

        <Stack spacing={2.5} sx={{ p: { xs: 3, sm: 5 }, justifyContent: "center" }}>
          <Box>
            <Typography variant="h2">{title}</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {subtitle}
            </Typography>
          </Box>
          {children}
        </Stack>
      </Card>
    </Box>
  );
}
