import { CameraAlt, PhotoLibrary, Send } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { type ChangeEvent, type ReactElement, useRef, useState } from "react";

import { fileToCompressedDataUrl } from "../utils/image";

interface ChatComposerProps {
  isSending: boolean;
  onSendText: (text: string) => void;
  onSendImage: (imageData: string) => void;
  onOpenCamera: () => void;
  onTyping: (isTyping: boolean) => void;
}

export function ChatComposer({
  isSending,
  onSendText,
  onSendImage,
  onOpenCamera,
  onTyping,
}: ChatComposerProps): ReactElement {
  const [text, setText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<number>();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
    onTyping(true);
    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = window.setTimeout(() => onTyping(false), 1500);
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    onSendText(trimmed);
    setText("");
    onTyping(false);
  };

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const dataUrl = await fileToCompressedDataUrl(file);
    onSendImage(dataUrl);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1,
        borderRadius: 6,
        border: "1px solid rgba(233, 30, 99, 0.15)",
        bgcolor: "background.paper",
      }}
    >
      <Stack direction="row" spacing={0.5} alignItems="flex-end">
        <Tooltip title="Send a love snap">
          <IconButton color="primary" onClick={onOpenCamera} aria-label="Open camera">
            <CameraAlt />
          </IconButton>
        </Tooltip>
        <Tooltip title="Share a photo">
          <IconButton
            color="primary"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach photo"
          >
            <PhotoLibrary />
          </IconButton>
        </Tooltip>

        <TextField
          value={text}
          onChange={handleChange}
          placeholder="Message your love..."
          multiline
          maxRows={4}
          fullWidth
          variant="standard"
          InputProps={{ disableUnderline: true, sx: { px: 1, py: 0.5 } }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
        />

        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={isSending || !text.trim()}
          aria-label="Send message"
          sx={{
            bgcolor: "primary.main",
            color: "white",
            "&:hover": { bgcolor: "primary.dark" },
            "&.Mui-disabled": { bgcolor: "rgba(233, 30, 99, 0.25)", color: "white" },
          }}
        >
          {isSending ? <CircularProgress size={20} color="inherit" /> : <Send />}
        </IconButton>
      </Stack>

      <Box
        component="input"
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        sx={{ display: "none" }}
      />
    </Paper>
  );
}
