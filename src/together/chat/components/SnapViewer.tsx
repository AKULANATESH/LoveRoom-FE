import { Close, Favorite } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Dialog,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { type ReactElement, useEffect, useRef, useState } from "react";

const VIEW_SECONDS = 8;

interface SnapViewerProps {
  open: boolean;
  imageData?: string;
  caption?: string;
  isLoading: boolean;
  onClose: () => void;
}

export function SnapViewer({
  open,
  imageData,
  caption,
  isLoading,
  onClose,
}: SnapViewerProps): ReactElement {
  const [secondsLeft, setSecondsLeft] = useState(VIEW_SECONDS);
  const intervalRef = useRef<number>();

  useEffect(() => {
    if (!open || !imageData) {
      return undefined;
    }

    setSecondsLeft(VIEW_SECONDS);
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(intervalRef.current);
          onClose();
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [open, imageData, onClose]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      PaperProps={{
        sx: {
          bgcolor: "#1a0510",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", top: 16, right: 16, color: "white", zIndex: 2 }}
        aria-label="Close snap"
      >
        <Close />
      </IconButton>

      {isLoading || !imageData ? (
        <CircularProgress color="secondary" />
      ) : (
        <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
          <Box
            component="img"
            src={imageData}
            alt="Snap"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />

          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            sx={{
              position: "absolute",
              top: 20,
              left: 20,
              px: 1.5,
              py: 0.5,
              borderRadius: 999,
              bgcolor: "rgba(0,0,0,0.5)",
            }}
          >
            <Favorite sx={{ fontSize: 16, color: "primary.main" }} />
            <Typography variant="caption" sx={{ color: "white", fontWeight: 700 }}>
              {secondsLeft}s
            </Typography>
          </Stack>

          {caption && (
            <Typography
              sx={{
                position: "absolute",
                bottom: 48,
                left: 0,
                right: 0,
                textAlign: "center",
                color: "white",
                px: 2,
                py: 1,
                bgcolor: "rgba(0,0,0,0.4)",
                fontWeight: 600,
              }}
            >
              {caption}
            </Typography>
          )}
        </Box>
      )}
    </Dialog>
  );
}
