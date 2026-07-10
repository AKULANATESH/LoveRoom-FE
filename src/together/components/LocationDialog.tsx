import { Close as CloseIcon } from "@mui/icons-material";
import { Dialog, DialogContent, IconButton, Stack, Typography } from "@mui/material";
import type { ReactElement } from "react";

import { LiveLocationView } from "./LiveLocationView";

interface LocationDialogProps {
  open: boolean;
  onClose: () => void;
}

export function LocationDialog({ open, onClose }: LocationDialogProps): ReactElement {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 3, pt: 2 }}>
        <Typography variant="h3">Partner location</Typography>
        <IconButton onClick={onClose} aria-label="Close location">
          <CloseIcon />
        </IconButton>
      </Stack>
      <DialogContent>
        <LiveLocationView />
      </DialogContent>
    </Dialog>
  );
}
