import type { ReactElement } from "react";

import { useSessionRefresh } from "./api/useSessionRefresh";

export function SessionRefresh(): ReactElement | null {
  useSessionRefresh();
  return null;
}
