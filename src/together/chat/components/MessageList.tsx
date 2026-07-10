import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { type ReactElement, useEffect, useRef } from "react";

import type { ChatMessage } from "../types";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";

interface MessageListProps {
  messages?: ChatMessage[];
  isLoading: boolean;
  partnerTyping: boolean;
  partnerName: string;
}

export function MessageList({
  messages,
  isLoading,
  partnerTyping,
  partnerName,
}: MessageListProps): ReactElement {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, partnerTyping]);

  if (isLoading && !messages) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <Stack spacing={1} alignItems="center" sx={{ py: 6, px: 3, textAlign: "center" }}>
        <Typography variant="h4">Say something sweet</Typography>
        <Typography color="text.secondary">
          Send the first message, a photo, or a love snap to {partnerName}.
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={1.5} sx={{ py: 2 }}>
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {partnerTyping && <TypingIndicator name={partnerName} />}
      <div ref={bottomRef} />
    </Stack>
  );
}
