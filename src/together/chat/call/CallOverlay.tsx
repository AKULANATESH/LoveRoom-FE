import {
  Call,
  CallEnd,
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Dialog,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { type ReactElement, useEffect, useRef } from "react";

import type { WebRTCCall } from "./useWebRTCCall";

interface CallOverlayProps {
  call: WebRTCCall;
  partnerName: string;
}

function useAttachStream(
  ref: React.RefObject<HTMLVideoElement>,
  stream?: MediaStream,
) {
  useEffect(() => {
    if (ref.current && stream) {
      ref.current.srcObject = stream;
    }
  }, [ref, stream]);
}

export function CallOverlay({ call, partnerName }: CallOverlayProps): ReactElement | null {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useAttachStream(localVideoRef, call.localStream);
  useAttachStream(remoteVideoRef, call.remoteStream);

  if (call.status === "idle" || call.status === "ended") {
    return null;
  }

  const isVideo = call.callType === "video";
  const isRinging = call.status === "incoming";
  const isCalling = call.status === "calling";
  const isActive = call.status === "connecting" || call.status === "connected";

  const statusLabel =
    call.status === "calling"
      ? "Calling..."
      : call.status === "incoming"
        ? `Incoming ${call.incoming?.callType ?? "video"} call`
        : call.status === "connecting"
          ? "Connecting..."
          : "Connected";

  return (
    <Dialog
      open
      fullScreen
      PaperProps={{
        sx: {
          background: "linear-gradient(160deg, #2a0716 0%, #7a1140 55%, #E91E63 120%)",
          color: "white",
        },
      }}
    >
      <Box sx={{ position: "relative", height: "100%", overflow: "hidden" }}>
        {isVideo && isActive && (
          <Box
            component="video"
            ref={remoteVideoRef}
            autoPlay
            playsInline
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              bgcolor: "black",
            }}
          />
        )}

        {isVideo && (
          <Box
            component="video"
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            sx={{
              position: "absolute",
              top: 24,
              right: 24,
              width: 120,
              height: 168,
              objectFit: "cover",
              borderRadius: 3,
              border: "2px solid rgba(255,255,255,0.5)",
              transform: "scaleX(-1)",
              zIndex: 2,
              bgcolor: "black",
            }}
          />
        )}

        <Stack
          spacing={2}
          alignItems="center"
          sx={{
            position: "relative",
            zIndex: 1,
            height: "100%",
            justifyContent: "space-between",
            py: 8,
          }}
        >
          <Stack spacing={2} alignItems="center">
            {(!isVideo || !isActive) && (
              <Avatar
                sx={{
                  width: 110,
                  height: 110,
                  bgcolor: "rgba(255,255,255,0.2)",
                  fontSize: 44,
                  fontWeight: 800,
                }}
              >
                {partnerName.charAt(0)}
              </Avatar>
            )}
            <Typography variant="h2" sx={{ color: "white" }}>
              {partnerName}
            </Typography>
            <Typography sx={{ opacity: 0.85 }}>{statusLabel}</Typography>
          </Stack>

          <Stack direction="row" spacing={3} alignItems="center">
            {isActive && (
              <IconButton
                onClick={call.toggleMute}
                sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white", width: 60, height: 60 }}
                aria-label="Toggle microphone"
              >
                {call.isMuted ? <MicOff /> : <Mic />}
              </IconButton>
            )}

            {isRinging ? (
              <>
                <IconButton
                  onClick={call.declineCall}
                  sx={{ bgcolor: "#e53935", color: "white", width: 68, height: 68 }}
                  aria-label="Decline call"
                >
                  <CallEnd />
                </IconButton>
                <IconButton
                  onClick={() => void call.acceptCall()}
                  sx={{ bgcolor: "#43a047", color: "white", width: 68, height: 68 }}
                  aria-label="Accept call"
                >
                  <Call />
                </IconButton>
              </>
            ) : (
              <IconButton
                onClick={call.endCall}
                sx={{ bgcolor: "#e53935", color: "white", width: 72, height: 72 }}
                aria-label="End call"
              >
                <CallEnd sx={{ fontSize: 32 }} />
              </IconButton>
            )}

            {isActive && isVideo && (
              <IconButton
                onClick={call.toggleCamera}
                sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white", width: 60, height: 60 }}
                aria-label="Toggle camera"
              >
                {call.isCameraOff ? <VideocamOff /> : <Videocam />}
              </IconButton>
            )}

            {isCalling && !isActive && <Box sx={{ width: 60 }} />}
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  );
}
