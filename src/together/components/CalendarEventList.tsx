import { Event, Place } from "@mui/icons-material";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import type { ReactElement } from "react";

import type { CalendarEventItem } from "../types";

interface CalendarEventListProps {
  events?: CalendarEventItem[];
  isLoading: boolean;
}

export function CalendarEventList({ events, isLoading }: CalendarEventListProps): ReactElement {
  if (isLoading && !events) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (!events || events.length === 0) {
    return (
      <Box
        sx={{
          p: 3,
          borderRadius: 4,
          bgcolor: "rgba(255,255,255,0.72)",
          border: "1px solid rgba(233, 30, 99, 0.1)",
          textAlign: "center",
        }}
      >
        <Typography color="text.secondary">
          No upcoming dates yet. Add your first plan together.
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={1.5}>
      {events.map((event) => (
        <Box
          key={event.id}
          sx={{
            p: 2,
            borderRadius: 4,
            bgcolor: "rgba(255,255,255,0.72)",
            border: "1px solid rgba(233, 30, 99, 0.1)",
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Event color="primary" />
            <Box>
              <Typography fontWeight={800}>{event.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {event.dateLabel} · {event.timeLabel}
              </Typography>
              {event.location && (
                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                  <Place sx={{ fontSize: 16 }} color="action" />
                  <Typography variant="body2">{event.location}</Typography>
                </Stack>
              )}
              {event.note && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {event.note}
                </Typography>
              )}
            </Box>
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}
