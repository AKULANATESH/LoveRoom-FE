import { environmentConfig } from "@src/environment";
import { queryClient } from "@src/api";
import { partnerActivityQueryKey } from "@src/together/api/usePartnerActivity";
import { connectionAwarenessQueryKey } from "@src/together/api/useConnectionAwareness";
import { calendarEventsQueryKey } from "@src/together/api/useCalendarEvents";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

interface RelationshipRealtimeState {
  partnerIsOnline: boolean;
  latestActivity: string;
}

export function useRelationshipRealtime(relationshipId?: string): RelationshipRealtimeState {
  const [state, setState] = useState<RelationshipRealtimeState>({
    partnerIsOnline: true,
    latestActivity: "Connected to your shared space",
  });

  useEffect(() => {
    if (!relationshipId) {
      return undefined;
    }

    const socket = io(environmentConfig.BACKEND_API_URL, {
      transports: ["websocket"],
      query: { relationshipId },
    });

    socket.on("presence:update", (payload: { partnerIsOnline: boolean; latestActivity: string }) => {
      setState(payload);
    });

    socket.on("action:received", (payload: { latestActivity: string }) => {
      setState((current) => ({ ...current, latestActivity: payload.latestActivity }));
      void queryClient.invalidateQueries({ queryKey: partnerActivityQueryKey });
    });

    socket.on("mood:shared", (payload: { latestActivity: string }) => {
      setState((current) => ({ ...current, latestActivity: payload.latestActivity }));
      void queryClient.invalidateQueries({ queryKey: partnerActivityQueryKey });
    });

    socket.on("partner:activity", () => {
      void queryClient.invalidateQueries({ queryKey: partnerActivityQueryKey });
      void queryClient.invalidateQueries({ queryKey: ["relationship", "home"] });
    });

    socket.on("connection:update", () => {
      void queryClient.invalidateQueries({ queryKey: connectionAwarenessQueryKey });
      void queryClient.invalidateQueries({ queryKey: calendarEventsQueryKey });
    });

    return () => {
      socket.disconnect();
    };
  }, [relationshipId]);

  return state;
}
