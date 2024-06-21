import { isDefined } from "@src/utils/isDefined";
import constate from "constate";
import { type Dispatch, type SetStateAction, useState } from "react";

interface AuthUser {
  userId: string;
  name: string;
}

interface UseAuth {
  authUser: AuthUser | undefined;
  isAuthenticated: boolean;
  setAuthUser: Dispatch<SetStateAction<AuthUser | undefined>>;
}

function useAuth(): UseAuth {
  const [authUser, setAuthUser] = useState<AuthUser>();

  return {
    authUser,
    isAuthenticated: isDefined(authUser),
    setAuthUser,
  };
}

export const [AuthProvider, useAuthContext] = constate(useAuth);
