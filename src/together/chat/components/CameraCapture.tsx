import { CameraAlt, Close, FlipCameraIos, Send } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { type ReactElement, useEffect, useRef, useState } from "react";

import { canvasToCompressedDataUrl } from "../utils/image";

interface CameraCaptureProps {
  open: boolean;
  onClose: () => void;
  onSend: (payload: { imageData: string; caption?: string; viewOnce: boolean }) => void;
  isSending: boolean;
}

export function CameraCapture({
  open,
  onClose,
  onSend,
  isSending,
}: CameraCaptureProps): ReactElement {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream>();
  const [captured, setCaptured] = useState<string>();
  const [caption, setCaption] = useState("");
  const [viewOnce, setViewOnce] = useState(true);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [error, setError] = useState<string>();
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (!open || captured) {
      return undefined;
    }

    let cancelled = false;
    setStarting(true);
    setError(undefined);

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setStarting(false);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not access the camera. Check permissions.");
          setStarting(false);
        }
      });

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = undefined;
    };
  }, [open, captured, facingMode]);

  const handleClose = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = undefined;
    setCaptured(undefined);
    setCaption("");
    setViewOnce(true);
    setError(undefined);
    onClose();
  };

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    setCaptured(canvasToCompressedDataUrl(canvas));
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = undefined;
  };

  const handleSend = () => {
    if (!captured) {
      return;
    }
    onSend({ imageData: captured, caption: caption.trim() || undefined, viewOnce });
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen
      PaperProps={{ sx: { bgcolor: "#120209" } }}
    >
      <IconButton
        onClick={handleClose}
        sx={{ position: "absolute", top: 16, right: 16, color: "white", zIndex: 3 }}
        aria-label="Close camera"
      >
        <Close />
      </IconButton>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {error ? (
          <Typography sx={{ color: "white", px: 3, textAlign: "center" }}>{error}</Typography>
        ) : captured ? (
          <Box
            component="img"
            src={captured}
            alt="Captured snap"
            sx={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
          />
        ) : (
          <>
            {starting && (
              <CircularProgress color="secondary" sx={{ position: "absolute" }} />
            )}
            <Box
              component="video"
              ref={videoRef}
              autoPlay
              playsInline
              muted
              sx={{
                maxWidth: "100%",
                maxHeight: "100%",
                transform: facingMode === "user" ? "scaleX(-1)" : undefined,
              }}
            />
          </>
        )}
      </Box>

      <Stack spacing={2} sx={{ p: 2, bgcolor: "rgba(0,0,0,0.4)" }}>
        {captured ? (
          <>
            <TextField
              placeholder="Add a caption..."
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              inputProps={{ maxLength: 280 }}
              sx={{ bgcolor: "white", borderRadius: 2 }}
            />
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <FormControlLabel
                control={
                  <Switch
                    checked={viewOnce}
                    onChange={(event) => setViewOnce(event.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography sx={{ color: "white" }}>
                    {viewOnce ? "View once (snap)" : "Keep in chat"}
                  </Typography>
                }
              />
              <Stack direction="row" spacing={1}>
                <Button onClick={() => setCaptured(undefined)} sx={{ color: "white" }}>
                  Retake
                </Button>
                <Button
                  variant="contained"
                  endIcon={isSending ? <CircularProgress size={16} color="inherit" /> : <Send />}
                  disabled={isSending}
                  onClick={handleSend}
                >
                  Send
                </Button>
              </Stack>
            </Stack>
          </>
        ) : (
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={4}>
            <IconButton
              onClick={() =>
                setFacingMode((mode) => (mode === "user" ? "environment" : "user"))
              }
              sx={{ color: "white" }}
              aria-label="Flip camera"
            >
              <FlipCameraIos />
            </IconButton>
            <IconButton
              onClick={handleCapture}
              disabled={starting || Boolean(error)}
              sx={{
                bgcolor: "primary.main",
                color: "white",
                width: 72,
                height: 72,
                "&:hover": { bgcolor: "primary.dark" },
              }}
              aria-label="Capture photo"
            >
              <CameraAlt sx={{ fontSize: 32 }} />
            </IconButton>
            <Box sx={{ width: 40 }} />
          </Stack>
        )}
      </Stack>
    </Dialog>
  );
}
