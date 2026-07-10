import { useEffect, useRef, useState } from "react";

import { useUpdateLocation } from "../api/useUpdateLocation";
import type { UpdateLocationRequest } from "../types";

const UPDATE_INTERVAL_MS = 20_000;
const MIN_MOVE_METERS = 40;

interface UseLiveLocationSharingOptions {
  serverSharingEnabled?: boolean;
}

interface UseLiveLocationSharingResult {
  isSharingEnabled: boolean;
  isUpdating: boolean;
  locationError?: string;
  setSharingEnabled: (enabled: boolean) => void;
}

function distanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadius = 6_371_000;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;

  return 2 * earthRadius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function reverseGeocode(latitude: number, longitude: number): Promise<string | undefined> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      { headers: { Accept: "application/json" } },
    );

    if (!response.ok) {
      return undefined;
    }

    const payload = (await response.json()) as { display_name?: string };
    return payload.display_name;
  } catch {
    return undefined;
  }
}

export function useLiveLocationSharing({
  serverSharingEnabled = false,
}: UseLiveLocationSharingOptions): UseLiveLocationSharingResult {
  const [isSharingEnabled, setIsSharingEnabled] = useState(serverSharingEnabled);
  const [locationError, setLocationError] = useState<string>();
  const watchIdRef = useRef<number>();
  const lastSentRef = useRef(0);
  const lastCoordsRef = useRef<{ latitude: number; longitude: number }>();
  const { mutate, isPending } = useUpdateLocation();
  const mutateRef = useRef(mutate);
  mutateRef.current = mutate;

  useEffect(() => {
    setIsSharingEnabled(serverSharingEnabled);
  }, [serverSharingEnabled]);

  useEffect(() => {
    if (!isSharingEnabled) {
      if (watchIdRef.current != null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = undefined;
      }

      if (serverSharingEnabled) {
        mutateRef.current({ isSharing: false });
      }

      return undefined;
    }

    if (!navigator.geolocation) {
      setLocationError("Your browser does not support live location.");
      setIsSharingEnabled(false);
      return undefined;
    }

    setLocationError(undefined);

    const sendPosition = (latitude: number, longitude: number, accuracy?: number) => {
      void (async () => {
        const locationLabel = await reverseGeocode(latitude, longitude);
        const payload: UpdateLocationRequest = {
          latitude,
          longitude,
          accuracy,
          isSharing: true,
          locationLabel,
        };

        mutateRef.current(payload);
        lastSentRef.current = Date.now();
        lastCoordsRef.current = { latitude, longitude };
      })();
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const now = Date.now();
        const lastCoords = lastCoordsRef.current;
        const movedEnough =
          !lastCoords ||
          distanceMeters(lastCoords.latitude, lastCoords.longitude, latitude, longitude) >=
            MIN_MOVE_METERS;
        const waitedEnough = now - lastSentRef.current >= UPDATE_INTERVAL_MS;

        if (!movedEnough && !waitedEnough) {
          return;
        }

        sendPosition(latitude, longitude, accuracy);
      },
      (error) => {
        setLocationError(
          error.code === error.PERMISSION_DENIED
            ? "Location permission denied. Allow location access to share live."
            : "Could not read your live location.",
        );
        setIsSharingEnabled(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10_000,
        timeout: 20_000,
      },
    );

    return () => {
      if (watchIdRef.current != null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = undefined;
      }
    };
  }, [isSharingEnabled, serverSharingEnabled]);

  return {
    isSharingEnabled,
    isUpdating: isPending,
    locationError,
    setSharingEnabled: setIsSharingEnabled,
  };
}
