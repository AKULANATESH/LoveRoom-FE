import { NotificationsActive as NotificationsActiveIcon } from "@mui/icons-material";
import { Box, Paper, Stack, Typography } from "@mui/material";
import type { ReactElement } from "react";

import type { NotificationItem } from "../types";

interface NotificationsPreviewProps {
  notification: NotificationItem | null;
}

export function NotificationsPreview({ notification }: NotificationsPreviewProps): ReactElement {
  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h3">Latest from your partner</Typography>
          <Typography color="text.secondary">Tiny signals that keep you close.</Typography>
        </Box>
        {notification ? (
          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              p: 2,
              borderRadius: 4,
              bgcolor: notification.isRead ? "background.default" : "rgba(255, 205, 210, 0.42)",
            }}
          >
            <NotificationsActiveIcon color="primary" />
            <Box>
              <Typography fontWeight={800}>{notification.title}</Typography>
              <Typography color="text.secondary">{notification.body}</Typography>
              <Typography variant="caption" color="text.secondary">
                {notification.createdAtLabel}
              </Typography>
            </Box>
          </Stack>
        ) : (
          <Typography color="text.secondary">
            No new signals yet. Send the first one and start today’s ritual.
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}
