import { Box, Button, Chip, Paper, Stack, TextField, Typography } from "@mui/material";
import { type ReactElement, useState } from "react";

import type { MoodType } from "../types";

interface MoodOption {
  value: MoodType;
  label: string;
  helper: string;
}

const moodOptions: MoodOption[] = [
  { value: "HAPPY", label: "Happy", helper: "Share the glow" },
  { value: "SAD", label: "Sad", helper: "Ask for softness" },
  { value: "EXCITED", label: "Excited", helper: "Invite celebration" },
  { value: "STRESSED", label: "Stressed", helper: "Ask for calm" },
  { value: "MISSING_YOU", label: "Missing you", helper: "Close the distance" },
  { value: "SLEEPY", label: "Sleepy", helper: "Send a gentle goodnight" },
];

interface MoodCenterCardProps {
  isSharing: boolean;
  onShare: (mood: MoodType, note?: string) => void;
}

export function MoodCenterCard({ isSharing, onShare }: MoodCenterCardProps): ReactElement {
  const [selectedMood, setSelectedMood] = useState<MoodType>("HAPPY");
  const [note, setNote] = useState("");

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h3">Mood check-in</Typography>
          <Typography color="text.secondary">
            Help your partner understand your inner weather today.
          </Typography>
        </Box>
        <Stack direction="row" useFlexGap flexWrap="wrap" gap={1}>
          {moodOptions.map((mood) => (
            <Chip
              key={mood.value}
              label={mood.label}
              color={selectedMood === mood.value ? "primary" : "default"}
              variant={selectedMood === mood.value ? "filled" : "outlined"}
              onClick={() => setSelectedMood(mood.value)}
              aria-label={`${mood.label}: ${mood.helper}`}
            />
          ))}
        </Stack>
        <TextField
          label="Add a little context"
          placeholder="I could use a little extra love today..."
          multiline
          minRows={2}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          inputProps={{ maxLength: 180 }}
        />
        <Button
          variant="contained"
          disabled={isSharing}
          onClick={() => {
            onShare(selectedMood, note.trim() || undefined);
            setNote("");
          }}
        >
          Share mood
        </Button>
      </Stack>
    </Paper>
  );
}
