import { Favorite, LockOutlined } from "@mui/icons-material";
import { alpha, Box, ButtonBase, Stack, Typography } from "@mui/material";
import { type ReactElement, useState } from "react";

import { useOpenSnap } from "../api/useOpenSnap";
import type { ChatMessage } from "../types";
import { SnapViewer } from "./SnapViewer";

interface SnapBubbleProps {
  message: ChatMessage;
}

export function SnapBubble({ message }: SnapBubbleProps): ReactElement {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [imageData, setImageData] = useState<string>();
  const [caption, setCaption] = useState<string>();
  const openSnap = useOpenSnap({
    onSuccess: (data) => {
      setImageData(data.imageData);
      setCaption(data.caption);
      setViewerOpen(true);
    },
  });

  // Sender's own snap: show as sent, with opened state.
  if (message.mine) {
    return (
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{
          px: 2,
          py: 1.5,
          borderRadius: 4,
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.9),
          color: "white",
        }}
      >
        <Favorite sx={{ fontSize: 18 }} />
        <Typography variant="body2" fontWeight={700}>
          {message.opened ? "Snap opened" : "Snap delivered"}
        </Typography>
      </Stack>
    );
  }

  // Recipient already opened this view-once snap: locked.
  if (message.opened) {
    return (
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{
          px: 2,
          py: 1.5,
          borderRadius: 4,
          bgcolor: "rgba(0,0,0,0.06)",
          color: "text.secondary",
        }}
      >
        <LockOutlined sx={{ fontSize: 18 }} />
        <Typography variant="body2" fontWeight={600}>
          Snap viewed
        </Typography>
      </Stack>
    );
  }

  // Recipient, unopened: kiss/tap the heart to open.
  return (
    <>
      <ButtonBase
        onClick={() => openSnap.mutate(message.id)}
        disabled={openSnap.isPending}
        sx={{
          px: 2.5,
          py: 2,
          borderRadius: 4,
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: "white",
        }}
      >
        <Stack direction="row" spacing={1.2} alignItems="center">
          <Box
            sx={{
              animation: openSnap.isPending ? "pulse 0.8s infinite" : undefined,
              "@keyframes pulse": {
                "0%, 100%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.25)" },
              },
            }}
          >
            <Favorite sx={{ fontSize: 24 }} />
          </Box>
          <Box sx={{ textAlign: "left" }}>
            <Typography variant="body2" fontWeight={800}>
              {openSnap.isPending ? "Opening..." : "New love snap"}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Tap the heart to view once
            </Typography>
          </Box>
        </Stack>
      </ButtonBase>

      <SnapViewer
        open={viewerOpen}
        imageData={imageData}
        caption={caption}
        isLoading={openSnap.isPending}
        onClose={() => setViewerOpen(false)}
      />
    </>
  );
}
