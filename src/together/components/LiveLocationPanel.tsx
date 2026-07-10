import { MyLocation, Place } from "@mui/icons-material";
import { alpha, Box, Chip, Link, Stack, Switch, Typography } from "@mui/material";
import type { ReactElement } from "react";

import type { ConnectionAwarenessData } from "../types";

interface LiveLocationPanelProps {
  data?: ConnectionAwarenessData;
  isSharingEnabled: boolean;
  isUpdating: boolean;
  locationError?: string;
  onToggleSharing: (enabled: boolean) => void;
}

function buildMapEmbedUrl(latitude: number, longitude: number): string {
  const delta = 0.01;
  const bbox = [
    longitude - delta,
    latitude - delta,
    longitude + delta,
    latitude + delta,
  ].join("%2C");

  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude}%2C${longitude}`;
}

function formatCoordinates(latitude: number, longitude: number): string {
  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
}

export function LiveLocationPanel({
  data,
  isSharingEnabled,
  isUpdating,
  locationError,
  onToggleSharing,
}: LiveLocationPanelProps): ReactElement {
  const myLocation = data?.myLocation;
  const partnerLocation = data?.partnerLocation;

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h3">Live location</Typography>
        <Typography color="text.secondary">
          Share your real-time location so your partner always knows where you are.
        </Typography>
      </Box>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          p: 2,
          borderRadius: 4,
          bgcolor: "rgba(255,255,255,0.72)",
          border: "1px solid rgba(233, 30, 99, 0.1)",
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <MyLocation color={isSharingEnabled ? "primary" : "disabled"} />
          <Box>
            <Typography fontWeight={800}>Share live location</Typography>
            <Typography variant="body2" color="text.secondary">
              Updates automatically while this is on
            </Typography>
          </Box>
        </Stack>
        <Switch
          checked={isSharingEnabled}
          disabled={isUpdating}
          onChange={(event) => onToggleSharing(event.target.checked)}
          inputProps={{ "aria-label": "Share live location" }}
        />
      </Stack>

      {locationError && (
        <Typography color="error" variant="body2">
          {locationError}
        </Typography>
      )}

      {isSharingEnabled && myLocation?.latitude != null && myLocation.longitude != null && (
        <Box
          sx={{
            p: 2,
            borderRadius: 4,
            bgcolor: alpha("#E91E63", 0.06),
            border: "1px solid rgba(233, 30, 99, 0.12)",
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Chip
              size="small"
              color={myLocation.isLive ? "success" : "default"}
              label={myLocation.isLive ? "Live now" : "Updating..."}
            />
            <Typography variant="caption" color="text.secondary">
              You · {myLocation.updatedAtLabel}
            </Typography>
          </Stack>
          <Typography fontWeight={700}>
            {myLocation.locationLabel ??
              formatCoordinates(myLocation.latitude, myLocation.longitude)}
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          p: 2,
          borderRadius: 4,
          bgcolor: "rgba(255,255,255,0.72)",
          border: "1px solid rgba(156, 39, 176, 0.12)",
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Typography variant="overline" color="text.secondary">
            Partner location
          </Typography>
          {partnerLocation?.isLive && (
            <Chip size="small" color="success" label="Live" sx={{ fontWeight: 800 }} />
          )}
        </Stack>

        {partnerLocation ? (
          <Stack spacing={1.5} sx={{ mt: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Place color="secondary" fontSize="small" />
              <Box>
                <Typography fontWeight={700}>
                  {partnerLocation.locationLabel ??
                    formatCoordinates(partnerLocation.latitude, partnerLocation.longitude)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Updated {partnerLocation.updatedAtLabel}
                  {partnerLocation.accuracy ? ` · ±${Math.round(partnerLocation.accuracy)}m` : ""}
                </Typography>
              </Box>
            </Stack>

            <Box
              component="iframe"
              title="Partner live location map"
              src={buildMapEmbedUrl(partnerLocation.latitude, partnerLocation.longitude)}
              sx={{
                width: "100%",
                height: 260,
                border: 0,
                borderRadius: 3,
              }}
            />

            <Link
              href={partnerLocation.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
            >
              Open in maps
            </Link>
          </Stack>
        ) : (
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Your partner has not turned on live location yet.
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
