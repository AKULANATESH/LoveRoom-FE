import { ArrowBack, Call, Videocam } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Container,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useToast } from "@src/lib/notifications/useToast";
import { type ReactElement, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useRelationshipHome } from "../../api/useRelationshipHome";
import { useCall } from "../call/CallProvider";
import { useChatMessages } from "../api/useChatMessages";
import { useMarkRead } from "../api/useMarkRead";
import { useSendMessage } from "../api/useSendMessage";
import { CameraCapture } from "../components/CameraCapture";
import { ChatComposer } from "../components/ChatComposer";
import { MessageList } from "../components/MessageList";
import { useChatSocket } from "../realtime/useChatSocket";

export function ChatPage(): ReactElement {
  const navigate = useNavigate();
  const toast = useToast();
  const relationshipHome = useRelationshipHome();
  const partnerName = relationshipHome.data?.partner.name ?? "Your partner";
  const partnerAvatar = relationshipHome.data?.partner.avatarUrl;

  const chatMessages = useChatMessages();
  const sendMessage = useSendMessage();
  const markRead = useMarkRead();
  const { partnerTyping, emitTyping } = useChatSocket();
  const call = useCall();

  const [cameraOpen, setCameraOpen] = useState(false);

  useEffect(() => {
    markRead.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatMessages.data?.length]);

  const handleSendText = (text: string) => {
    sendMessage.mutate({ type: "TEXT", text });
  };

  const handleSendImage = (imageData: string) => {
    sendMessage.mutate({ type: "IMAGE", imageData, viewOnce: false });
  };

  const handleSendSnap = (payload: {
    imageData: string;
    caption?: string;
    viewOnce: boolean;
  }) => {
    sendMessage.mutate(
      {
        type: payload.viewOnce ? "SNAP" : "IMAGE",
        imageData: payload.imageData,
        caption: payload.caption,
        viewOnce: payload.viewOnce,
      },
      {
        onSuccess: () =>
          toast.showSuccessToast(payload.viewOnce ? "Love snap sent" : "Photo sent"),
      },
    );
  };

  return (
    <Container maxWidth="md" disableGutters sx={{ height: "100%" }}>
      <Stack sx={{ height: "100%" }} spacing={0}>
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            borderRadius: 0,
            borderBottom: "1px solid rgba(233, 30, 99, 0.12)",
            position: "sticky",
            top: 0,
            zIndex: 2,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <IconButton
                onClick={() => navigate("/together")}
                sx={{ display: { md: "none" } }}
                aria-label="Back"
              >
                <ArrowBack />
              </IconButton>
              <Avatar src={partnerAvatar} sx={{ bgcolor: "primary.main", fontWeight: 800 }}>
                {partnerName.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h4">{partnerName}</Typography>
                <Typography variant="caption" color={partnerTyping ? "primary.main" : "text.secondary"}>
                  {partnerTyping ? "typing..." : "Tap the call icons to connect"}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Audio call">
                <IconButton
                  color="primary"
                  onClick={() => void call.startCall("audio")}
                  aria-label="Start audio call"
                >
                  <Call />
                </IconButton>
              </Tooltip>
              <Tooltip title="Video call">
                <IconButton
                  color="primary"
                  onClick={() => void call.startCall("video")}
                  aria-label="Start video call"
                >
                  <Videocam />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Paper>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            bgcolor: "background.default",
          }}
        >
          <MessageList
            messages={chatMessages.data}
            isLoading={chatMessages.isLoading}
            partnerTyping={partnerTyping}
            partnerName={partnerName}
          />
        </Box>

        <Box sx={{ p: 1.5, position: "sticky", bottom: 0, bgcolor: "background.default" }}>
          <ChatComposer
            isSending={sendMessage.isPending}
            onSendText={handleSendText}
            onSendImage={handleSendImage}
            onOpenCamera={() => setCameraOpen(true)}
            onTyping={emitTyping}
          />
        </Box>
      </Stack>

      <CameraCapture
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onSend={handleSendSnap}
        isSending={sendMessage.isPending}
      />
    </Container>
  );
}
