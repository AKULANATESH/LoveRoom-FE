import { Button, Stack, TextField, Typography } from "@mui/material";
import type { ReactElement } from "react";
import { useState } from "react";

interface AddCalendarEventFormProps {
  isCreating: boolean;
  onCreateEvent: (payload: {
    title: string;
    date: string;
    location?: string;
    note?: string;
  }) => void;
}

function toLocalDateTimeValue(date = new Date()): string {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

export function AddCalendarEventForm({
  isCreating,
  onCreateEvent,
}: AddCalendarEventFormProps): ReactElement {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(toLocalDateTimeValue());
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Plan a date</Typography>
      <TextField
        label="Event title"
        placeholder="Date night, trip, anniversary..."
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        inputProps={{ maxLength: 120 }}
      />
      <TextField
        label="Date and time"
        type="datetime-local"
        value={date}
        onChange={(event) => setDate(event.target.value)}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Location"
        placeholder="Restaurant, park, home..."
        value={location}
        onChange={(event) => setLocation(event.target.value)}
        inputProps={{ maxLength: 180 }}
      />
      <TextField
        label="Note"
        placeholder="Anything special to remember"
        value={note}
        onChange={(event) => setNote(event.target.value)}
        inputProps={{ maxLength: 280 }}
        multiline
        minRows={2}
      />
      <Button
        variant="contained"
        disabled={isCreating || !title.trim() || !date}
        onClick={() => {
          onCreateEvent({
            title: title.trim(),
            date: new Date(date).toISOString(),
            location: location.trim() || undefined,
            note: note.trim() || undefined,
          });
          setTitle("");
          setDate(toLocalDateTimeValue());
          setLocation("");
          setNote("");
        }}
      >
        Save to calendar
      </Button>
    </Stack>
  );
}
