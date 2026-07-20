import { get } from "@src/api";
import { useCallback, useEffect } from "react";

import { authResponseSchema } from "../types";
import { useAuthContext } from "../useAuth";

async function fetchSession() {
  const response = await get({
    url: "/auth/me",
    responseSchema: authResponseSchema,
  });
  return response.data;
}

export function useSessionRefresh(): void {
  const { isAuthenticated, setAuthFromResponse } = useAuthContext();

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      const data = await fetchSession();
      setAuthFromResponse(data);
    } catch {
      // Token may be expired; user can sign in again.
    }
  }, [isAuthenticated, setAuthFromResponse]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const onFocus = () => {
      void refresh();
    };
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
    };
  }, [refresh]);
}
