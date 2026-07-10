import type { ReactElement } from "react";

import { useConnectionAwareness } from "../api/useConnectionAwareness";
import { useLiveLocationSharing } from "../hooks/useLiveLocationSharing";
import { LiveLocationPanel } from "./LiveLocationPanel";

export function LiveLocationView(): ReactElement {
  const connectionAwareness = useConnectionAwareness();
  const liveLocation = useLiveLocationSharing({
    serverSharingEnabled: connectionAwareness.data?.myLocation.isSharing ?? false,
  });

  return (
    <LiveLocationPanel
      data={connectionAwareness.data}
      isSharingEnabled={liveLocation.isSharingEnabled}
      isUpdating={liveLocation.isUpdating}
      locationError={liveLocation.locationError}
      onToggleSharing={liveLocation.setSharingEnabled}
    />
  );
}
