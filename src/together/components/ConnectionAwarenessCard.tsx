import { Favorite, FavoriteBorder } from "@mui/icons-material";
import {
  alpha,
  Box,
  Button,
  ButtonBase,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import type { ReactElement } from "react";

import type { ConnectionAwarenessData } from "../types";

interface ConnectionAwarenessCardProps {
  data?: ConnectionAwarenessData;
  isLoading: boolean;
  isRecording: boolean;
  onTouchHour: (hour: number) => void;
  onTouchNow: () => void;
}

function getCurrentHour(): number {
  const hour = new Date().getHours();
  if (hour < 8) {
    return 8;
  }
  if (hour > 21) {
    return 21;
  }
  return hour;
}

export function ConnectionAwarenessCard({
  data,
  isLoading,
  isRecording,
  onTouchHour,
  onTouchNow,
}: ConnectionAwarenessCardProps): ReactElement {
  const currentHour = getCurrentHour();
  const currentSlot = data?.hourlyTouches.find((slot) => slot.hour === currentHour);

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="h3">Daytime connection</Typography>
          <Typography color="text.secondary">
            Tap each hour to let your partner know you are thinking of them.
          </Typography>
        </Box>

        {isLoading && !data ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress size={28} />
          </Box>
        ) : (
          <>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <Chip
                color="primary"
                label={`${data?.streak.current ?? 0} day streak`}
                sx={{ fontWeight: 800 }}
              />
              <Chip
                variant="outlined"
                label={`Best: ${data?.streak.longest ?? 0} days`}
                sx={{ fontWeight: 700 }}
              />
            </Stack>

            <Typography color="text.secondary">{data?.streak.label}</Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                gap: 1,
              }}
            >
              {data?.hourlyTouches.map((slot) => {
                const isCurrent = slot.hour === currentHour;
                const isTappable = !slot.mine && !isRecording;

                return (
                  <ButtonBase
                    key={slot.hour}
                    disabled={!isTappable}
                    onClick={() => onTouchHour(slot.hour)}
                    aria-label={`${slot.hourLabel}${slot.mine ? ", you touched" : ""}${slot.partner ? ", partner touched" : ""}`}
                    sx={{
                      borderRadius: 3,
                      p: 1,
                      minHeight: 72,
                      flexDirection: "column",
                      gap: 0.5,
                      bgcolor: slot.both
                        ? alpha("#E91E63", 0.18)
                        : slot.mine
                          ? alpha("#E91E63", 0.1)
                          : slot.partner
                            ? alpha("#9C27B0", 0.08)
                            : "rgba(255,255,255,0.7)",
                      border: isCurrent
                        ? "2px solid #E91E63"
                        : "1px solid rgba(233, 30, 99, 0.12)",
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      {slot.hourLabel}
                    </Typography>
                    <Stack direction="row" spacing={0.25}>
                      {slot.mine ? (
                        <Favorite sx={{ fontSize: 16, color: "primary.main" }} />
                      ) : (
                        <FavoriteBorder sx={{ fontSize: 16, color: "text.disabled" }} />
                      )}
                      {slot.partner ? (
                        <Favorite sx={{ fontSize: 16, color: "secondary.main" }} />
                      ) : (
                        <FavoriteBorder sx={{ fontSize: 16, color: "text.disabled" }} />
                      )}
                    </Stack>
                  </ButtonBase>
                );
              })}
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="center">
              <Button
                variant="contained"
                disabled={isRecording || currentSlot?.mine}
                onClick={onTouchNow}
              >
                {currentSlot?.mine ? "Touched this hour" : "Touch this hour"}
              </Button>
              <Typography variant="body2" color="text.secondary">
                Left heart = you · Right heart = partner
              </Typography>
            </Stack>
          </>
        )}
      </Stack>
    </Paper>
  );
}
