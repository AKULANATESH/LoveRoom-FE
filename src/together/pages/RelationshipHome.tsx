import { Box, Chip, Container, Fade, Stack, Typography } from "@mui/material";
import { useToast } from "@src/lib/notifications/useToast";
import { type ReactElement, useState } from "react";

import { useRelationshipHome } from "../api/useRelationshipHome";
import { useSendEmotionalAction } from "../api/useSendEmotionalAction";
import { useShareMood } from "../api/useShareMood";
import { useConnectionAwareness } from "../api/useConnectionAwareness";
import { useRecordHourlyTouch } from "../api/useRecordHourlyTouch";
import { usePartnerActivity } from "../api/usePartnerActivity";
import { useCalendarEvents } from "../api/useCalendarEvents";
import { MilestoneStrip } from "../components/MilestoneStrip";
import { MoodCenterCard } from "../components/MoodCenterCard";
import { NotificationsPreview } from "../components/NotificationsPreview";
import { PartnerPresenceCard } from "../components/PartnerPresenceCard";
import { QuickActions } from "../components/QuickActions";
import { ConnectionAwarenessCard } from "../components/ConnectionAwarenessCard";
import { LocationDialog } from "../components/LocationDialog";
import { TogetherHeaderActions } from "../components/TogetherHeaderActions";
import { EmptyState, ErrorState, LoadingState } from "../components/StateViews";
import { useRelationshipRealtime } from "../realtime/useRelationshipRealtime";
import type { EmotionalActionType, MoodType } from "../types";

const actionSuccessCopy: Record<EmotionalActionType, string> = {
  HUG: "Your hug is on its way.",
  KISS: "Your kiss just crossed the distance.",
  MISS_YOU: "They will know they are missed.",
  THINKING_OF_YOU: "A tender reminder was sent.",
};

export function RelationshipHome(): ReactElement {
  const toast = useToast();
  const [celebrationCopy, setCelebrationCopy] = useState<string>();
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const relationshipHome = useRelationshipHome();
  const realtime = useRelationshipRealtime(relationshipHome.data?.relationship.id);
  const sendAction = useSendEmotionalAction({
    onSuccess: (response) => {
      const message = actionSuccessCopy[response.type];
      toast.showSuccessToast(message);
      setCelebrationCopy(message);
      window.setTimeout(() => setCelebrationCopy(undefined), 1800);
    },
  });
  const shareMood = useShareMood({
    onSuccess: () => {
      toast.showSuccessToast("Your mood was shared with care.");
    },
  });
  const connectionAwareness = useConnectionAwareness();
  const partnerActivity = usePartnerActivity();
  const calendarEvents = useCalendarEvents();
  const recordTouch = useRecordHourlyTouch({
    onSuccess: () => {
      toast.showSuccessToast("Your partner will feel this hour.");
    },
  });

  if (relationshipHome.isLoading) {
    return <LoadingState />;
  }

  if (relationshipHome.isError) {
    return <ErrorState onRetry={() => void relationshipHome.refetch()} />;
  }

  if (!relationshipHome.data) {
    return (
      <EmptyState
        title="Invite your partner"
        description="Together becomes meaningful once your private relationship space has both hearts inside it."
      />
    );
  }

  const { partner, relationship, recentNotification } = relationshipHome.data;
  const nextCalendarEvent = calendarEvents.data?.[0] ?? null;

  return (
    <Container maxWidth="lg" disableGutters sx={{ pb: 6 }}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Box>
            <Typography variant="overline" color="text.secondary">
              Together
            </Typography>
            <Typography variant="h1">Your private space for two</Typography>
            <Typography color="text.secondary">{relationship.startedAtLabel}</Typography>
          </Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <TogetherHeaderActions
              partnerLocationLive={connectionAwareness.data?.partnerLocation?.isLive}
              upcomingEventsCount={calendarEvents.data?.length ?? 0}
              onOpenLocation={() => setLocationDialogOpen(true)}
            />
            <Chip
              color="primary"
              label={`${relationship.daysTogether} days together`}
              sx={{ fontWeight: 800, px: 1 }}
            />
          </Stack>
        </Stack>

        <PartnerPresenceCard
          partner={partner}
          partnerIsOnline={realtime.partnerIsOnline || partner.presence.isOnline}
          latestActivity={realtime.latestActivity || partner.presence.currentActivity}
          emotionStats={partnerActivity.data?.emotionStats}
        />

        <ConnectionAwarenessCard
          data={connectionAwareness.data}
          isLoading={connectionAwareness.isLoading}
          isRecording={recordTouch.isPending}
          onTouchHour={(hour) => recordTouch.mutate({ hour })}
          onTouchNow={() => recordTouch.mutate({})}
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1.35fr 0.9fr" },
            gap: 3,
          }}
        >
          <Stack spacing={3}>
            <QuickActions
              activeAction={sendAction.isPending ? sendAction.variables?.type : undefined}
              onSend={(type) => sendAction.mutate({ type })}
            />
            <MoodCenterCard
              isSharing={shareMood.isPending}
              onShare={(mood: MoodType, note?: string) => shareMood.mutate({ mood, note })}
            />
          </Stack>

          <Stack spacing={3}>
            <Box
              sx={{
                p: 3,
                borderRadius: 7,
                bgcolor: "rgba(255, 255, 255, 0.72)",
                border: "1px solid rgba(233, 30, 99, 0.1)",
              }}
            >
              <Typography variant="h3">Today’s love prompt</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {relationship.dailyPrompt}
              </Typography>
            </Box>
            <MilestoneStrip nextEvent={nextCalendarEvent} isLoading={calendarEvents.isLoading} />
            <NotificationsPreview notification={recentNotification} />
          </Stack>
        </Box>
      </Stack>

      <LocationDialog open={locationDialogOpen} onClose={() => setLocationDialogOpen(false)} />

      <Fade in={Boolean(celebrationCopy)}>
        <Box
          aria-live="polite"
          sx={{
            position: "fixed",
            left: "50%",
            bottom: 28,
            transform: "translateX(-50%)",
            px: 3,
            py: 1.5,
            borderRadius: 999,
            bgcolor: "primary.main",
            color: "white",
            fontWeight: 800,
            boxShadow: "0 18px 44px rgba(233, 30, 99, 0.34)",
            zIndex: (theme) => theme.zIndex.snackbar,
          }}
        >
          {celebrationCopy}
        </Box>
      </Fade>
    </Container>
  );
}
