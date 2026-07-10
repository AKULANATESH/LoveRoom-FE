import { CalendarMonth as CalendarMonthIcon, Place as PlaceIcon } from "@mui/icons-material";
import { Box, Button, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";

import type { CalendarEventItem } from "../types";

interface MilestoneStripProps {
  nextEvent?: CalendarEventItem | null;
  isLoading?: boolean;
}

function formatUpcomingLabel(event: CalendarEventItem): string {
  if (event.daysUntil === 0) {
    return `Today · ${event.timeLabel}`;
  }
  if (event.daysUntil === 1) {
    return `Tomorrow · ${event.timeLabel}`;
  }
  return `${event.dateLabel} · ${event.daysUntil} days`;
}

export function MilestoneStrip({ nextEvent, isLoading }: MilestoneStripProps): ReactElement {
  const navigate = useNavigate();

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h3">Moments coming up</Typography>
          <Typography color="text.secondary">Your next shared date on the calendar.</Typography>
        </Box>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : nextEvent ? (
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="flex-start"
            sx={{
              p: 2,
              borderRadius: 4,
              bgcolor: "background.default",
            }}
          >
            <CalendarMonthIcon color="primary" />
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={800}>{nextEvent.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {formatUpcomingLabel(nextEvent)}
              </Typography>
              {nextEvent.location && (
                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                  <PlaceIcon sx={{ fontSize: 16 }} color="action" />
                  <Typography variant="body2">{nextEvent.location}</Typography>
                </Stack>
              )}
            </Box>
          </Stack>
        ) : (
          <Stack spacing={1.5}>
            <Typography color="text.secondary">
              No dates planned yet. Add one to see your next moment here.
            </Typography>
            <Button variant="outlined" onClick={() => navigate("/together/calendar")}>
              Plan a date
            </Button>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}
