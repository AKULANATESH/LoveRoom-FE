import {
  ChatBubble as ChatBubbleIcon,
  Event as EventIcon,
  MyLocation as MyLocationIcon,
} from "@mui/icons-material";
import { Badge, IconButton, Stack, Tooltip } from "@mui/material";
import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";

interface TogetherHeaderActionsProps {
  partnerLocationLive?: boolean;
  upcomingEventsCount?: number;
  onOpenLocation: () => void;
}

export function TogetherHeaderActions({
  partnerLocationLive,
  upcomingEventsCount = 0,
  onOpenLocation,
}: TogetherHeaderActionsProps): ReactElement {
  const navigate = useNavigate();

  return (
    <Stack direction="row" spacing={0.5}>
      <Tooltip title="Chat">
        <IconButton
          onClick={() => navigate("/together/chat")}
          aria-label="Open chat"
          sx={{
            bgcolor: "rgba(255,255,255,0.8)",
            border: "1px solid rgba(233, 30, 99, 0.12)",
          }}
        >
          <ChatBubbleIcon color="primary" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Partner location">
        <IconButton
          onClick={onOpenLocation}
          aria-label="Open partner location"
          sx={{
            bgcolor: "rgba(255,255,255,0.8)",
            border: "1px solid rgba(233, 30, 99, 0.12)",
          }}
        >
          <Badge color="success" variant="dot" invisible={!partnerLocationLive}>
            <MyLocationIcon color="primary" />
          </Badge>
        </IconButton>
      </Tooltip>

      <Tooltip title="Shared calendar">
        <IconButton
          onClick={() => navigate("/together/calendar")}
          aria-label="Open shared calendar"
          sx={{
            bgcolor: "rgba(255,255,255,0.8)",
            border: "1px solid rgba(233, 30, 99, 0.12)",
          }}
        >
          <Badge badgeContent={upcomingEventsCount || undefined} color="primary">
            <EventIcon color="primary" />
          </Badge>
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
