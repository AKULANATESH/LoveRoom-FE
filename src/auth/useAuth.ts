import { isDefined } from "@src/utils/isDefined";
import constate from "constate";
import { useCallback, useMemo, useState } from "react";

import { clearAuthState, loadAuthState, saveAuthState, type StoredAuthState } from "./storage";
import type { AuthResponse } from "./types";

interface UseAuth {
  authState: StoredAuthState | undefined;
  isAuthenticated: boolean;
  hasPartner: boolean;
  setAuthFromResponse: (response: AuthResponse) => void;
  logout: () => void;
  updateAuthState: (partial: Partial<StoredAuthState>) => void;
}

function useAuth(): UseAuth {
  const [authState, setAuthState] = useState<StoredAuthState | undefined>(() => loadAuthState());

  const setAuthFromResponse = useCallback((response: AuthResponse) => {
    const nextState = saveAuthState(response);
    setAuthState(nextState);
  }, []);

  const logout = useCallback(() => {
    clearAuthState();
    setAuthState(undefined);
  }, []);

  const updateAuthState = useCallback((partial: Partial<StoredAuthState>) => {
    setAuthState((current) => {
      if (!current) {
        return current;
      }
      const nextState = { ...current, ...partial };
      saveAuthState({
        accessToken: nextState.accessToken,
        user: nextState.user,
        hasPartner: nextState.hasPartner,
        relationshipId: nextState.relationshipId,
        pendingInviteCode: nextState.pendingInviteCode,
      });
      return nextState;
    });
  }, []);

  return useMemo(
    () => ({
      authState,
      isAuthenticated: isDefined(authState),
      hasPartner: Boolean(authState?.hasPartner),
      setAuthFromResponse,
      logout,
      updateAuthState,
    }),
    [authState, logout, setAuthFromResponse, updateAuthState],
  );
}

export const [AuthProvider, useAuthContext] = constate(useAuth);
