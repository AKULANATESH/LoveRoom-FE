import { Box, Container, Paper, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useAuthContext } from "@src/auth/useAuth";
import { useToast } from "@src/lib/notifications/useToast";
import type { ReactElement, SyntheticEvent } from "react";
import { useState } from "react";

import { useCalendarEvents } from "../api/useCalendarEvents";
import { useCreateCalendarEvent } from "../api/useCreateCalendarEvent";
import { AddCalendarEventForm } from "../components/AddCalendarEventForm";
import { CalendarEventList } from "../components/CalendarEventList";
import { SoloEmptyState } from "../components/SoloEmptyState";

export function SharedCalendarPage(): ReactElement {
  const toast = useToast();
  const { hasPartner } = useAuthContext();
  const [tab, setTab] = useState<"view" | "add">("view");
  const calendarEvents = useCalendarEvents({ enabled: hasPartner });
  const createCalendarEvent = useCreateCalendarEvent({
    onSuccess: () => {
      toast.showSuccessToast("Added to your shared calendar.");
      setTab("view");
    },
  });

  const handleTabChange = (_event: SyntheticEvent, value: "view" | "add") => {
    setTab(value);
  };

  if (!hasPartner) {
    return (
      <Container maxWidth="md" disableGutters sx={{ pb: 6 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="overline" color="text.secondary">
              Together
            </Typography>
            <Typography variant="h1">Shared calendar</Typography>
          </Box>
          <SoloEmptyState page="calendar" />
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" disableGutters sx={{ pb: 6 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="overline" color="text.secondary">
            Together
          </Typography>
          <Typography variant="h1">Shared calendar</Typography>
          <Typography color="text.secondary">
            View upcoming dates and plan moments together.
          </Typography>
        </Box>

        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
          <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="View events" value="view" />
            <Tab label="Add event" value="add" />
          </Tabs>

          {tab === "view" ? (
            <CalendarEventList events={calendarEvents.data} isLoading={calendarEvents.isLoading} />
          ) : (
            <AddCalendarEventForm
              isCreating={createCalendarEvent.isPending}
              onCreateEvent={(payload) => createCalendarEvent.mutate(payload)}
            />
          )}
        </Paper>
      </Stack>
    </Container>
  );
}
