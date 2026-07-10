import { Favorite } from "@mui/icons-material";
import { alpha, Box, Stack, Typography } from "@mui/material";
import { type ReactElement, useRef } from "react";

import { useReactToMessage } from "../api/useReactToMessage";
import type { ChatMessage } from "../types";
import { SnapBubble } from "./SnapBubble";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps): ReactElement {
  const reactToMessage = useReactToMessage();
  const lastTapRef = useRef(0);

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      reactToMessage.mutate({ messageId: message.id, reaction: "❤️" });
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  };

  const isSnap = message.type === "SNAP";

  return (
    <Stack
      direction="row"
      justifyContent={message.mine ? "flex-end" : "flex-start"}
      sx={{ px: 1 }}
    >
      <Box sx={{ maxWidth: "78%" }}>
        <Box
          onClick={handleDoubleTap}
          onDoubleClick={() =>
            reactToMessage.mutate({ messageId: message.id, reaction: "❤️" })
          }
          sx={{ position: "relative", cursor: "pointer" }}
        >
          {isSnap ? (
            <SnapBubble message={message} />
          ) : message.type === "IMAGE" && message.imageData ? (
            <Box
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                border: (theme) => `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              <Box
                component="img"
                src={message.imageData}
                alt={message.caption ?? "Shared photo"}
                sx={{ display: "block", width: "100%", maxWidth: 260 }}
              />
              {message.caption && (
                <Typography variant="body2" sx={{ px: 1.5, py: 1 }}>
                  {message.caption}
                </Typography>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                px: 2,
                py: 1.2,
                borderRadius: 4,
                bgcolor: (theme) =>
                  message.mine ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.08),
                color: message.mine ? "white" : "text.primary",
                borderBottomRightRadius: message.mine ? 4 : undefined,
                borderBottomLeftRadius: message.mine ? undefined : 4,
              }}
            >
              <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                {message.text}
              </Typography>
            </Box>
          )}

          {message.reaction && (
            <Box
              sx={{
                position: "absolute",
                bottom: -10,
                right: message.mine ? 8 : undefined,
                left: message.mine ? undefined : 8,
                bgcolor: "background.paper",
                borderRadius: 999,
                px: 0.5,
                boxShadow: 1,
                fontSize: 14,
                lineHeight: 1.4,
              }}
            >
              {message.reaction}
            </Box>
          )}
        </Box>

        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          justifyContent={message.mine ? "flex-end" : "flex-start"}
          sx={{ mt: message.reaction ? 1.5 : 0.5, px: 0.5 }}
        >
          <Typography variant="caption" color="text.secondary">
            {message.timeLabel}
          </Typography>
          {message.mine && message.readByPartner && (
            <Stack direction="row" spacing={0.25} alignItems="center">
              <Favorite sx={{ fontSize: 11, color: "primary.main" }} />
              <Typography variant="caption" color="primary.main" fontWeight={700}>
                Seen
              </Typography>
            </Stack>
          )}
        </Stack>
      </Box>
    </Stack>
  );
}
