import type { AuthResponse, AuthUser } from "./types";

const TOKEN_KEY = "together_access_token";
const AUTH_STATE_KEY = "together_auth_state";

export interface StoredAuthState {
  accessToken: string;
  user: AuthUser;
  hasPartner: boolean;
  relationshipId?: string;
  pendingInviteCode?: string;
}

export function saveAuthState(response: AuthResponse): StoredAuthState {
  const state: StoredAuthState = {
    accessToken: response.accessToken,
    user: response.user,
    hasPartner: response.hasPartner,
    relationshipId: response.relationshipId,
    pendingInviteCode: response.pendingInviteCode,
  };
  localStorage.setItem(TOKEN_KEY, response.accessToken);
  localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(state));
  return state;
}

export function loadAuthState(): StoredAuthState | undefined {
  const token = localStorage.getItem(TOKEN_KEY);
  const raw = localStorage.getItem(AUTH_STATE_KEY);
  if (!token || !raw) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(raw) as StoredAuthState;
    if (!parsed.user?.id) {
      return undefined;
    }
    return { ...parsed, accessToken: token };
  } catch {
    return undefined;
  }
}

export function clearAuthState(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(AUTH_STATE_KEY);
}

export function getAccessToken(): string | undefined {
  return localStorage.getItem(TOKEN_KEY) ?? undefined;
}
