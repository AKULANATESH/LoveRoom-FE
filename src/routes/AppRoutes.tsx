import { useAuthContext } from "@src/auth/useAuth";
import { NotFoundPage, PageWithMenu } from "@src/lib/layouts";
import { InvitePartner } from "@src/login/pages/InvitePartner";
import { JoinWithCode } from "@src/login/pages/JoinWithCode";
import { Login } from "@src/login/pages/Login";
import { Register } from "@src/login/pages/Register";
import { ResetPassword } from "@src/login/pages/ResetPassword";
import { Welcome } from "@src/login/pages/Welcome";
import { TogetherRoutes } from "@src/together/Routes";
import { type ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

function ProtectedShell(): ReactElement {
  const { isAuthenticated, hasPartner } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasPartner) {
    return <Navigate to="/invite" replace />;
  }

  return <PageWithMenu />;
}

export function AppRoutes(): ReactElement {
  return (
    <Routes>
      <Route index element={<Welcome />} />
      <Route path="register" element={<Register />} />
      <Route path="login" element={<Login />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route path="join" element={<JoinWithCode />} />
      <Route path="join/:code" element={<JoinWithCode />} />
      <Route path="invite" element={<InvitePartner />} />

      <Route element={<ProtectedShell />}>
        <Route index element={<Navigate to="together" replace />} />
        <Route path="together/*" element={<TogetherRoutes />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
