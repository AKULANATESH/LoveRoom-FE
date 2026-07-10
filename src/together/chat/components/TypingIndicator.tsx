import { Favorite } from "@mui/icons-material";
import { Box, keyframes, Stack, Typography } from "@mui/material";
import type { ReactElement } from "react";

const bounce = keyframes`
  0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
  40% { transform: translateY(-4px); opacity: 1; }
`;

interface TypingIndicatorProps {
  name: string;
}

export function TypingIndicator({ name }: TypingIndicatorProps): ReactElement {
  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 1, py: 0.5 }}>
      <Stack direction="row" spacing={0.3}>
        {[0, 1, 2].map((index) => (
          <Box
            key={index}
            sx={{
              animation: `${bounce} 1.2s infinite`,
              animationDelay: `${index * 0.15}s`,
              display: "inline-flex",
            }}
          >
            <Favorite sx={{ fontSize: 12, color: "primary.main" }} />
          </Box>
        ))}
      </Stack>
      <Typography variant="caption" color="text.secondary">
        {name} is typing...
      </Typography>
    </Stack>
  );
}
