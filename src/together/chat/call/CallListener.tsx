import { useAuthContext } from "@src/auth/useAuth";
import type { ReactElement } from "react";

import { CallOverlay } from "./CallOverlay";
import { useCall } from "./CallProvider";

export function CallListener(): ReactElement | null {
  const call = useCall();
  const { authState } = useAuthContext();

  if (!authState?.relationshipId) {
    return null;
  }

  return <CallOverlay call={call} partnerName={call.incoming?.fromName ?? "Your partner"} />;
}
