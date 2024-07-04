import { Box } from "@mui/material";
import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function FullScreenPageLayout(props: Props) {
  const { children } = props;
  return (
    <Box
      sx={{
        height: "100vh",
        overflow: "hidden",
        backgroundSize: "cover",
        backgroundColor: (theme) => theme.palette.background.default,
        display: "flex",
      }}
    >
      {children}
    </Box>
  );
}
