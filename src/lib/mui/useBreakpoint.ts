import { type Breakpoint, type Theme, useMediaQuery } from "@mui/material";

export function useBreakpoint(breakpoint: Breakpoint = "sm"): boolean {
  return useMediaQuery((theme: Theme) => theme.breakpoints.down(breakpoint));
}
